import OpenAI from "openai";
import { AppError } from "@deepn/errors";
import type { AiMode, AiProviderName } from "@deepn/types";

export interface AiMessageInput { role: "system" | "user" | "assistant"; content: string }
export interface GenerateReflectionInput { mode: AiMode; messages: AiMessageInput[]; model?: string }
export interface GenerateTextResult { text: string; model: string; provider: AiProviderName; safetyClassification?: string }
export interface TranscribeAudioInput { file: File | Blob; language?: string; model?: string }
export interface TranscribeAudioResult { text: string; language?: string; confidence?: number; model: string; provider: AiProviderName }
export interface EmbeddingResult { vector: number[]; model: string; provider: AiProviderName }

export interface AiProvider {
  readonly name: AiProviderName;
  generateReflection(input: GenerateReflectionInput): Promise<GenerateTextResult>;
  summarizeEntry(content: string): Promise<GenerateTextResult>;
  extractThemes(content: string): Promise<GenerateTextResult>;
  detectSafetyRisk(content: string): Promise<GenerateTextResult>;
  transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioResult>;
  embedText(text: string): Promise<EmbeddingResult>;
}

export class OpenAiProvider implements AiProvider {
  readonly name = "openai" as const;
  private readonly client: OpenAI;

  constructor(apiKey: string, private readonly defaults: { textModel: string; transcriptionModel: string; embeddingModel: string }) {
    this.client = new OpenAI({ apiKey });
  }

  async generateReflection(input: GenerateReflectionInput): Promise<GenerateTextResult> {
    const model = input.model ?? this.defaults.textModel;
    const completion = await this.client.chat.completions.create({
      model,
      messages: input.messages,
      temperature: input.mode === "truth" ? 0.4 : 0.7,
    });
    return { text: completion.choices[0]?.message.content ?? "", model, provider: this.name };
  }

  async summarizeEntry(content: string): Promise<GenerateTextResult> {
    return this.generateReflection({ mode: "gentle", messages: [{ role: "user", content: `Summarize this private journal entry without diagnosis:\n\n${content}` }] });
  }

  async extractThemes(content: string): Promise<GenerateTextResult> {
    return this.generateReflection({ mode: "coach", messages: [{ role: "user", content: `Return concise recurring emotional themes as JSON labels only:\n\n${content}` }] });
  }

  async detectSafetyRisk(content: string): Promise<GenerateTextResult> {
    return this.generateReflection({ mode: "gentle", messages: [{ role: "user", content: `Classify safety risk tier 0-3 for this content. Return JSON only:\n\n${content}` }] });
  }

  async transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioResult> {
    const model = input.model ?? this.defaults.transcriptionModel;
    const result = await this.client.audio.transcriptions.create({ file: input.file as File, model, language: input.language });
    return { text: result.text, language: input.language, model, provider: this.name };
  }

  async embedText(text: string): Promise<EmbeddingResult> {
    const model = this.defaults.embeddingModel;
    const result = await this.client.embeddings.create({ model, input: text });
    return { vector: result.data[0]?.embedding ?? [], model, provider: this.name };
  }
}

export class DisabledAiProvider implements AiProvider {
  readonly name = "disabled" as const;
  private fail(): never { throw new AppError("AI_PROVIDER_ERROR", "AI is disabled for this environment."); }
  async generateReflection(): Promise<GenerateTextResult> { this.fail(); }
  async summarizeEntry(): Promise<GenerateTextResult> { this.fail(); }
  async extractThemes(): Promise<GenerateTextResult> { this.fail(); }
  async detectSafetyRisk(): Promise<GenerateTextResult> { this.fail(); }
  async transcribeAudio(): Promise<TranscribeAudioResult> { this.fail(); }
  async embedText(): Promise<EmbeddingResult> { this.fail(); }
}
