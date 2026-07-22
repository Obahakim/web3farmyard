export type FeatureFlag =
  | "vault.enabled"
  | "audio.enabled"
  | "ai.enabled"
  | "lockedVault.enabled"
  | "timeline.enabled"
  | "walletAuth.enabled"
  | "commons.enabled"
  | "sleepagotchi.enabled"
  | "selfHostedAi.enabled";

const defaults: Record<FeatureFlag, boolean> = {
  "vault.enabled": true,
  "audio.enabled": true,
  "ai.enabled": true,
  "lockedVault.enabled": true,
  "timeline.enabled": true,
  "walletAuth.enabled": false,
  "commons.enabled": false,
  "sleepagotchi.enabled": false,
  "selfHostedAi.enabled": false,
};

export function isFeatureEnabled(flag: FeatureFlag, env: NodeJS.ProcessEnv = process.env): boolean {
  const key = `FEATURE_${flag.toUpperCase().replaceAll(".", "_")}`;
  const value = env[key];
  if (value === "true") return true;
  if (value === "false") return false;
  return defaults[flag];
}

export function getFeatureFlags(env: NodeJS.ProcessEnv = process.env): Record<FeatureFlag, boolean> {
  return Object.keys(defaults).reduce((acc, flag) => {
    acc[flag as FeatureFlag] = isFeatureEnabled(flag as FeatureFlag, env);
    return acc;
  }, {} as Record<FeatureFlag, boolean>);
}
