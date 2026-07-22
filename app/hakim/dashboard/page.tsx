'use client'
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
const db = createClient(process.env.NEXT_PUBLIC_SUPA_URL!, process.env.NEXT_PUBLIC_SUPA_KEY!)

interface Airdrop {
    id: string;
    name: string;
    logo?: string;
    reward_amount: string;
    task?: string;
    chain?: string;
    risk?: string;
    deadline?: string;
    url?: string;
    status?: string;
    topics?: string[];
    image_url?: string;
}

interface Subscriber {
    id: string;
    email: string;
    farmer_name?: string | null;
    topics?: string[];
    subscribed?: boolean;
    created_at?: string;
    frequency?: string;
}



 function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState("airdrops");
    const [posts, setPosts] = useState([]);





    return (
        <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f0f0f0" }}>
            <div style={{ borderBottom: "1px solid #111", padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", zIndex: 100, flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
                    <div style={{ fontFamily: "serif", fontSize: "17px", fontWeight: "700", color: "#f0f0f0", letterSpacing: "-0.02em" }}>WEB3FARMYARD.COM</div>
                    <div style={{ fontFamily: "mono", fontSize: "8px", color: "#2a2a2a", letterSpacing: "0.15em" }}>ADMIN . </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button onClick={() => setLoggedIn(false)} style={{ background: "transparent", border: "1px solid #1e1e1e", color: "#3a3a3a", padding: "5px 12px", fontFamily: "mono", fontSize: "8px", cursor: "pointer" }}>LOG OUT</button>
                </div>
            </div>
            <main style={{ maxWidth: "940px", margin: "0 auto", padding: "36px" }}>
                {loading ? (
                    <div style={{ fontFamily: "mono", fontSize: "10px", color: "#333", letterSpacing: "0.15em", padding: "60px 0", textAlign: "center" }}>
                        LOADING FROM SUPABASE...
                    </div>
                ) : (
                    <div>
                        <StatsBar posts={[]} users={[]} airdrops={[]} subscribers={[]} />
                        <TabBar active={tab} onChange={setTab} />
                        {tab === "airdrops" && <AirdropsTab />}
                        {tab === "newsletter" && <NewsletterSendTab />}
                        {tab === "subscribers" && <SubscribersTab isuser={false} />}
                        {tab === "users" && <SubscribersTab isuser={true} />}


                    </div>
                )}
            </main>
        </div>
    );
}

interface StatsBarProps {
    posts: any[];
    users: any[];
    airdrops: any[];
    subscribers: any[];
}

function StatsBar({airdrops, subscribers }: StatsBarProps) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1px", background: "#434343", marginBottom: "32px" }}>
            {[ ["AIRDROPS", airdrops.length, "#00ffe0"], ["SUBSCRIBERS", subscribers.length, "#c8ff00"]].map(([l, v, c]) => (
                <div key={l.toString()} style={{ background: "#0a0a0a", padding: "14px 18px" }}>
                    <div style={{ fontFamily: "mono", fontSize: "8px", color: "d7caca", letterSpacing: "0.12em", marginBottom: "4px" }}>{l}</div>
                    <div style={{ fontFamily: "serif", fontSize: "22px", fontWeight: "700", color: c.toString() }}>{v}</div>
                </div>
            ))}
        </div>
    );
}

interface TabBarProps {
    active: string;
    onChange: (tabId: string) => void;
}

function TabBar({ active, onChange }: TabBarProps) {
    const tabs = [{ id: "airdrops", label: "🌾 Airdrops" }, { id: "users", label: "👥 users" }, { id: "subscribers", label: "📬 Subscribers" }, { id: "newsletter", label: "✉️ Send Newsletter" }];
    return (
        <div style={{ display: "flex", borderBottom: "1px solid #151515", marginBottom: "32px", overflowX: "auto" }}>
            {tabs.map(t => <button key={t.id} onClick={() => onChange(t.id)} style={{ background: "transparent", border: "none", borderBottom: active === t.id ? "2px solid #c8ff00" : "2px solid transparent", color: active === t.id ? "#c8ff00" : "#3a3a3a", padding: "11px 18px", fontFamily: "mono", fontSize: "9px", letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.15s", marginBottom: "-1px", whiteSpace: "nowrap" }}>{t.label}</button>)}
        </div>
    );
}

function NewsletterSendTab() {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("all");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState("");
    const [preview, setPreview] = useState(false);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

    useEffect(() => {
        db.from("subscribers")
            .select("id, email, farmer_name, topics, subscribed, created_at, frequency")
            .eq("subscribed", true)
            .then(({ data, error }) => {
                if (error) {
                    console.error("Failed to load subscribers for newsletter tab:", error);
                    return;
                }
                if (data) setSubscribers(data as Subscriber[]);
            })
    }, [])

    const NEWSLETTER_TOPICS_LIST = [
        { id: "defi", label: "DeFi", icon: "📈" },
        { id: "airdrops", label: "Airdrops", icon: "🪂" },
        { id: "nft", label: "NFTs & Collectibles", icon: "🖼️" },
        { id: "layer2", label: "Layer 2 & Infra", icon: "⚡" },
        { id: "dao", label: "DAOs & Governance", icon: "🗳️" },
        { id: "zk", label: "ZK & Privacy", icon: "🔐" },
        { id: "rwa", label: "RWA Tokenization", icon: "🏦" },
        { id: "security", label: "Security & Hacks", icon: "🛡️" },
        { id: "meme", label: "Memecoins & Culture", icon: "🐸" },
        { id: "ai", label: "AI + Crypto", icon: "🤖" },
        { id: "depin", label: "DePIN", icon: "📡" },
        { id: "regulation", label: "Regulation & Policy", icon: "⚖️" },
    ];

    const targeted = selectedTopic === "all"
        ? subscribers
        : subscribers.filter(s => (s.topics || []).includes(selectedTopic));

    async function sendNewsletter() {
        if (!subject.trim() || !body.trim()) { setStatus("Subject and body are required."); return; }
        if (targeted.length === 0) { setStatus("No subscribers match this topic."); return; }
        if (!confirm(`Send to ${targeted.length} subscriber${targeted.length > 1 ? "s" : ""}?`)) return;

        setSending(true);
        setStatus(`Sending to ${targeted.length} subscribers...`);

        const response = await fetch('/api/send-newsletter/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: subject,
                content: `<p>${body}</p>`,
            }),
        });

        if (response.status === 200) {
            setSending(false)
            setStatus('Hooray🎉 your newsletter has been sent')
        }
    }

    const inp = { width: "100%", background: "#080808", border: "1px solid #151515", color: "#ccc", padding: "9px 12px", fontFamily: "serif", fontSize: "14px", outline: "none", marginBottom: "14px", lineHeight: "1.6" };
    const lbl = { fontFamily: "mono", fontSize: "8px", color: "#3a3a3a", letterSpacing: "0.15em", display: "block", marginBottom: "5px" };

    return (
        <div>
            <div style={{ fontFamily: "serif", fontSize: "20px", fontWeight: "700", color: "#f0f0f0", marginBottom: "6px" }}>Send Newsletter</div>
            <p style={{ fontFamily: "serif", fontSize: "13px", color: "#444", lineHeight: "1.6", marginBottom: "24px" }}>
                Write your email, pick a topic, and send to all matching subscribers at once.
            </p>

            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", padding: "18px", marginBottom: "20px" }}>
                <div style={{ fontFamily: "mono", fontSize: "8px", color: "#c8ff00", letterSpacing: "0.2em", marginBottom: "12px" }}>TARGET AUDIENCE</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <button onClick={() => setSelectedTopic("all")} style={{ padding: "5px 14px", fontFamily: "mono", fontSize: "9px", letterSpacing: "0.1em", cursor: "pointer", background: selectedTopic === "all" ? "#c8ff00" : "transparent", color: selectedTopic === "all" ? "#0a0a0a" : "#555", border: `1px solid ${selectedTopic === "all" ? "#c8ff00" : "#222"}`, transition: "all 0.15s" }}>ALL TOPICS</button>
                    {NEWSLETTER_TOPICS_LIST.map(t => (
                        <button key={t.id} onClick={() => setSelectedTopic(t.id)} style={{ padding: "5px 12px", fontFamily: "mono", fontSize: "9px", letterSpacing: "0.08em", cursor: "pointer", background: selectedTopic === t.id ? "#c8ff00" : "transparent", color: selectedTopic === t.id ? "#0a0a0a" : "#555", border: `1px solid ${selectedTopic === t.id ? "#c8ff00" : "#222"}`, transition: "all 0.15s" }}>{t.icon} {t.label}</button>
                    ))}
                </div>
                <div style={{ fontFamily: "mono", fontSize: "9px", color: targeted.length > 0 ? "#c8ff00" : "#ff4d4d", letterSpacing: "0.12em" }}>
                    {targeted.length} SUBSCRIBER{targeted.length !== 1 ? "S" : ""} WILL RECEIVE THIS EMAIL
                </div>
            </div>

            <label style={lbl}>SUBJECT LINE *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. This week in DeFi — Web3Farmyard" style={inp} />

            <label style={lbl}>EMAIL BODY *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={10}
                placeholder="Write your newsletter content here. Keep it punchy and valuable."
                style={{ ...inp, resize: "vertical", fontFamily: "serif" }} />

            <button onClick={() => setPreview(p => !p)} style={{ background: "transparent", border: "1px solid #222", color: "#555", padding: "7px 16px", fontFamily: "mono", fontSize: "9px", letterSpacing: "0.1em", cursor: "pointer", marginBottom: "14px" }}>
                {preview ? "HIDE PREVIEW" : "👁 PREVIEW EMAIL"}
            </button>

            {preview && subject && (
                <div style={{ border: "1px solid #1a1a1a", padding: "24px", marginBottom: "14px", background: "#060606" }}>
                    <div style={{ fontFamily: "mono", fontSize: "8px", color: "#c8ff00", letterSpacing: "0.2em", marginBottom: "6px" }}>WEB3FARMYARD.COM</div>
                    <div style={{ fontFamily: "serif", fontSize: "20px", fontWeight: "700", color: "#f0f0f0", marginBottom: "16px", letterSpacing: "-0.02em" }}>{subject}</div>
                    <div style={{ fontFamily: "serif", fontSize: "14px", color: "#888", lineHeight: "1.85", whiteSpace: "pre-wrap" }}>{body}</div>
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #1a1a1a", fontFamily: "mono", fontSize: "9px", color: "#c8ff00", letterSpacing: "0.12em" }}>↗ READ MORE ON WEB3FARMYARD.COM</div>
                </div>
            )}

            {status && <div style={{ fontFamily: "mono", fontSize: "9px", color: status.startsWith("✓") ? "#c8ff00" : status.includes("failed") || status.includes("required") || status.includes("No sub") ? "#ff4d4d" : "#ff9f00", letterSpacing: "0.1em", marginBottom: "12px" }}>{status}</div>}

            <button onClick={sendNewsletter} disabled={sending || targeted.length === 0} style={{ background: sending || targeted.length === 0 ? "#111" : "#c8ff00", color: sending || targeted.length === 0 ? "#333" : "#0a0a0a", border: "none", padding: "11px 24px", fontFamily: "mono", fontSize: "10px", letterSpacing: "0.15em", cursor: sending || targeted.length === 0 ? "not-allowed" : "pointer", fontWeight: "700" }}>
                {sending ? `SENDING...` : `↗ SEND TO ${targeted.length} SUBSCRIBER${targeted.length !== 1 ? "S" : ""}`}
            </button>
        </div>
    );
}

function AirdropsTab() {
    const [airdrops, updateDrop] = useState<Airdrop[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const emptyForm = { name: "", logo: "🪂", reward_amount: "", task: "", chain: "", risk: "low", deadline: "", url: "", image_url: "" };
    const [form, setForm] = useState<Record<string, string>>(emptyForm);
    const [listStatus, setListStatus] = useState("");

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const inp = { width: "100%", background: "#080808", border: "1px solid #151515", color: "#ccc", padding: "9px 12px", fontFamily: "serif", fontSize: "14px", outline: "none", marginBottom: "14px", lineHeight: "1.6" };
    const lbl = { fontFamily: "mono", fontSize: "8px", color: "#3a3a3a", letterSpacing: "0.15em", display: "block", marginBottom: "5px" };

    const onAdd = (a: Airdrop) => updateDrop(as => [...as, a]);
    const onRemove = (id: string) => updateDrop(as => as.filter(a => a.id !== id));
    const onUpdate = (a: Airdrop) => updateDrop(as => as.map(d => d.id === a.id ? a : d));

    useEffect(() => {
        db.from("airdrops").select("*")
            .then(({ data }) => {
                setLoading(false)
                if (data) updateDrop(data as Airdrop[])
            })
    }, [])

    async function handleAdd() {
        if (!form.name.trim() || !form.reward_amount.trim()) { setListStatus("Name and reward required."); return; }
        setSaving(true);

        if (editingId) {
            // Editing an existing listing
            const { data, error } = await db.from("airdrops").update({ ...form }).eq("id", editingId).select().single();
            setSaving(false);
            if (error) { console.error("Update failed:", error); setListStatus("Update failed: " + error.message); return; }
            if (data) onUpdate(data as Airdrop);
            setForm(emptyForm);
            setEditingId(null);
            setAdding(false); setListStatus("✓ Airdrop updated.");
            setTimeout(() => setListStatus(""), 3000);
            return;
        }

        // Adding a brand new listing
        const { data, error } = await db.from("airdrops").insert({ ...form, status: "live" }).select().single();
        setSaving(false);
        if (error) { console.error("Insert failed:", error); setListStatus("Save failed: " + error.message); return; }
        if (data) onAdd(data as Airdrop);
        setForm(emptyForm);
        setAdding(false); setListStatus("✓ Airdrop added.");
        setTimeout(() => setListStatus(""), 3000);
    }

    function handleEdit(drop: Airdrop) {
        setForm({
            name: drop.name || "",
            logo: drop.logo || "🪂",
            reward_amount: drop.reward_amount || "",
            task: drop.task || "",
            chain: drop.chain || "",
            risk: drop.risk || "low",
            deadline: drop.deadline || "",
            url: drop.url || "",
            image_url: drop.image_url || "",
        });
        setEditingId(drop.id);
        setAdding(true);
        setListStatus("");
    }

    function handleCancel() {
        setForm(emptyForm);
        setEditingId(null);
        setAdding(false);
    }

    async function handleRemove(id: string) {
        await db.from("airdrops").delete().eq("id", id);
        onRemove(id);
        if (editingId === id) handleCancel();
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#0a0a0a", marginBottom: "20px" }}>Airdrops</div>
            {loading && <div style={{ background: "#0a0a0a", padding: "24px", fontFamily: "mono", fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.12em" }}>AIRDROPS ARE LOADING...</div>}
            {!loading && !airdrops.length && <div style={{ background: "#0a0a0a", padding: "24px", fontFamily: "mono", fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.12em" }}>NO AIRDROP LISTINGS YET.</div>}

            {airdrops.map(drop => (
                <div key={drop.id} style={{ background: "#0a0a0a", padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    {drop.image_url ? (
                        <img
                            src={drop.image_url}
                            alt={drop.name}
                            style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "4px", border: "1px solid #1a1a1a" }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", background: "#0f0f0f", borderRadius: "4px", border: "1px solid #1a1a1a" }}>{drop.logo || "🪂"}</div>
                    )}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "serif", fontSize: "14px", color: "#e0e0e0", marginBottom: "3px" }}>{drop.name}</div>
                        {/* Swapped drop.reward to drop.reward_amount to match state keys */}
                        <div style={{ fontFamily: "mono", fontSize: "8px", color: "#333" }}>{drop.reward_amount} · {drop.chain} · {drop.deadline}</div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => handleEdit(drop)} style={{ background: "transparent", color: "#c8ff00", border: "1px solid #c8ff00", padding: "4px 10px", fontFamily: "mono", fontSize: "8px", cursor: "pointer" }}>✎ EDIT</button>
                        <button onClick={() => handleRemove(drop.id)} style={{ background: "transparent", color: "#ff4d4d", border: "1px solid #ff4d4d", padding: "4px 10px", fontFamily: "mono", fontSize: "8px", cursor: "pointer" }}>❌ REMOVE</button>
                    </div>
                </div>
            ))}

            {!adding ? (
                <button onClick={() => setAdding(true)} style={{ background: "transparent", border: "1px solid #c8ff00", color: "#c8ff00", padding: "8px 18px", fontFamily: "mono", fontSize: "9px", letterSpacing: "0.12em", cursor: "pointer" }}>+ ADD AIRDROP LISTING</button>
            ) : (
                <div style={{ border: "1px solid #1a1a1a", padding: "22px", maxWidth: "500px" }}>
                    <div style={{ fontFamily: "mono", fontSize: "8px", color: "#c8ff00", letterSpacing: "0.2em", marginBottom: "14px" }}>{editingId ? "EDIT AIRDROP LISTING" : "NEW AIRDROP LISTING"}</div>
                    {listStatus && (
                        <div style={{ fontFamily: "mono", fontSize: "9px", color: listStatus.startsWith("✓") ? "#c8ff00" : "#ff4d4d", letterSpacing: "0.08em", marginBottom: "14px", padding: "8px 10px", border: `1px solid ${listStatus.startsWith("✓") ? "#c8ff00" : "#ff4d4d"}` }}>
                            {listStatus}
                        </div>
                    )}
                    {[["name", "PROJECT NAME *"], ["logo", "EMOJI LOGO"], ["reward_amount", "REWARD *"], ["task", "TASK DESCRIPTION"], ["chain", "CHAIN"], ["deadline", "DEADLINE"], ["url", "PROJECT WEBSITE URL"], ["image_url", "IMAGE URL (for card preview)"]].map(([k, l]) => (
                        <div key={k}>
                            <div style={lbl}>{l}</div>
                            <input value={form[k] || ""} onChange={e => set(k, e.target.value)} style={inp} placeholder={k === "image_url" ? "https://..." : ""} />
                        </div>
                    ))}
                    {form.image_url && form.image_url.trim() && (
                        <div style={{ marginBottom: "16px" }}>
                            <div style={lbl}>IMAGE PREVIEW</div>
                            <div style={{ width: "100%", height: "140px", borderRadius: "6px", overflow: "hidden", border: "1px solid #1a1a1a", background: "#050505" }}>
                                <img
                                    src={form.image_url}
                                    alt="preview"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            </div>
                        </div>
                    )}
                    <div style={lbl}>RISK LEVEL</div>
                    <select value={form.risk} onChange={e => set("risk", e.target.value)} style={{ ...inp, marginBottom: "16px" }}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={handleAdd} disabled={saving} style={{ background: "#c8ff00", color: "#0a0a0a", border: "none", padding: "8px 18px", fontFamily: "mono", fontSize: "9px", letterSpacing: "0.12em", cursor: saving ? "not-allowed" : "pointer", fontWeight: "700" }}>{saving ? "SAVING..." : editingId ? "✓ SAVE CHANGES" : "✓ ADD LISTING"}</button>
                        <button onClick={handleCancel} style={{ background: "transparent", color: "#444", border: "1px solid #1e1e1e", padding: "8px 18px", fontFamily: "mono", fontSize: "9px", cursor: "pointer" }}>CANCEL</button>
                    </div>
                </div>
            )}
        </div>
    )
}

function SubscribersTab({ isuser }: { isuser: boolean }) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const onRemove = (id: string) => setSubscribers(ss => ss.filter(s => s.id !== id));

    useEffect(() => {
        db.from("subscribers").select("*")
            .then(({ data }) => {
                if (data) setSubscribers(data as Subscriber[]);
            })
    }, [])
    async function handleRemove(id: string) {
        await db.from("subscribers").delete().eq("id", id);
        onRemove(id);
    }
    return (
        <>
            {isuser ?
                (
                    <div>
                        <div style={{ fontFamily: "serif", fontSize: "20px", fontWeight: "700", color: "#f0f0f0", marginBottom: "8px" }}>Newsletter Users ({subscribers.length})</div>
                        <p style={{ fontFamily: "serif", fontSize: "13px", color: "#444", lineHeight: "1.6", marginBottom: "20px" }}>All real users from your live site appear here in real time.</p>
                        {subscribers.length === 0 ? (
                            <div style={{ fontFamily: "mono", fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.12em", padding: "24px 0" }}>NO Users YET — SHARE YOUR SITE!</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#111" }}>
                                {subscribers.map(s => (
                                    <div key={s.id} style={{ background: "#0a0a0a", padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: "mono", fontSize: "11px", color: "#e0e0e0", marginBottom: "5px" }}>{s.farmer_name}</div>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
                                                {(s.topics || []).map(t => <span key={t} style={{ fontFamily: "mono", fontSize: "8px", color: "#c8ff00", border: "1px solid #c8ff00", padding: "1px 7px", letterSpacing: "0.08em" }}>{t}</span>)}
                                            </div>
                                            <div style={{ fontFamily: "mono", fontSize: "8px", color: "#2a2a2a", letterSpacing: "0.1em" }}>{s.frequency} · {new Date(s.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div style={{ fontFamily: "serif", fontSize: "20px", fontWeight: "700", color: "#f0f0f0", marginBottom: "8px" }}>Newsletter Subscribers ({subscribers.length})</div>
                        <p style={{ fontFamily: "serif", fontSize: "13px", color: "#444", lineHeight: "1.6", marginBottom: "20px" }}>All real subscribers from your live site appear here in real time.</p>
                        {subscribers.length === 0 ? (
                            <div style={{ fontFamily: "mono", fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.12em", padding: "24px 0" }}>NO SUBSCRIBERS YET — SHARE YOUR SITE!</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#111" }}>
                                {subscribers.map(s => (
                                    <div key={s.id} style={{ background: "#0a0a0a", padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: "mono", fontSize: "11px", color: "#e0e0e0", marginBottom: "5px" }}>{s.email}</div>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
                                                {(s.topics || []).map(t => <span key={t} style={{ fontFamily: "mono", fontSize: "8px", color: "#c8ff00", border: "1px solid #c8ff00", padding: "1px 7px", letterSpacing: "0.08em" }}>{t}</span>)}
                                            </div>
                                            <div style={{ fontFamily: "mono", fontSize: "8px", color: "#2a2a2a", letterSpacing: "0.1em" }}>{s.frequency} · {new Date(s.created_at).toLocaleDateString()}</div>
                                        </div>
                                            <button onClick={() => handleRemove(s.id)} style={{ background: "transparent", color: "#ff4d4d", border: "1px solid #ff4d4d", padding: "4px 10px", fontFamily: "mono", fontSize: "8px", cursor: "pointer" }}>❌ REMOVE</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            }
        </>
    );
}

export default Dashboard;