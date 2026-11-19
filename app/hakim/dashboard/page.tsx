'use client'
import { useEffect, useState, type FormEvent } from "react";
import { adminGet, adminPost, adminPatch, adminDelete, adminSendNewsletter, adminLogout, setAdminCsrfToken } from "@/lib/admin-api";

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
    const [tab, setTab] = useState("airdrops");
    const [authState, setAuthState] = useState<"checking" | "signedOut" | "signedIn">("checking");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [authBusy, setAuthBusy] = useState(false);

    useEffect(() => {
        let active = true;
        fetch("/api-proxy.php?action=admin-session", { credentials: "include", cache: "no-store" })
            .then(async response => {
                const result = await response.json().catch(() => ({}));
                if (!active) return;
                if (response.ok && result.authenticated && result.csrfToken) {
                    setAdminCsrfToken(result.csrfToken);
                    setAuthState("signedIn");
                } else {
                    setAdminCsrfToken(null);
                    setAuthState("signedOut");
                }
            })
            .catch(() => { if (active) setAuthState("signedOut"); });
        return () => { active = false; };
    }, []);

    async function handleLogin(event: FormEvent) {
        event.preventDefault();
        setAuthBusy(true);
        setAuthError("");
        try {
            const response = await fetch("/api-proxy.php?action=admin-login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.authenticated || !result.csrfToken) throw new Error(result.error || "Unable to sign in.");
            setAdminCsrfToken(result.csrfToken);
            setPassword("");
            setAuthState("signedIn");
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : "Unable to sign in.");
        } finally {
            setAuthBusy(false);
        }
    }

    async function handleLogout() {
        try { await adminLogout(); }
        catch (error) { console.error("Admin logout failed:", error); }
        finally {
            setAdminCsrfToken(null);
            setAuthState("signedOut");
            setTab("airdrops");
        }
    }

    if (authState === "checking") {
        return <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#c8ff00", display: "grid", placeItems: "center", fontFamily: "monospace" }}>VERIFYING ADMIN SESSION...</div>;
    }

    if (authState === "signedOut") {
        return (
            <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", display: "grid", placeItems: "center", padding: "24px" }}>
                <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "380px", border: "1px solid #202020", background: "#0d0d0d", padding: "28px" }}>
                    <div style={{ color: "#c8ff00", fontFamily: "monospace", fontSize: "10px", letterSpacing: ".18em", marginBottom: "12px" }}>WEB3FARMYARD / ADMIN</div>
                    <h1 style={{ fontFamily: "serif", fontSize: "26px", marginBottom: "8px" }}>Dashboard access</h1>
                    <p style={{ color: "#777", fontSize: "13px", marginBottom: "22px" }}>Sign in to manage the Farmyard.</p>
                    <label htmlFor="admin-password" style={{ display: "block", color: "#888", fontFamily: "monospace", fontSize: "9px", marginBottom: "7px" }}>ADMIN PASSWORD</label>
                    <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required style={{ width: "100%", boxSizing: "border-box", background: "#080808", border: "1px solid #292929", color: "#fff", padding: "12px", marginBottom: "14px" }} />
                    {authError && <p role="alert" style={{ color: "#ff6565", fontSize: "12px", marginBottom: "14px" }}>{authError}</p>}
                    <button type="submit" disabled={authBusy} style={{ width: "100%", background: "#c8ff00", color: "#080808", border: 0, padding: "12px", fontFamily: "monospace", fontWeight: 700, cursor: authBusy ? "wait" : "pointer" }}>{authBusy ? "VERIFYING..." : "SIGN IN"}</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f0f0f0" }}>
            <div style={{ borderBottom: "1px solid #111", padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", zIndex: 100, flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
                    <div style={{ fontFamily: "serif", fontSize: "17px", fontWeight: "700", color: "#f0f0f0", letterSpacing: "-0.02em" }}>WEB3FARMYARD.COM</div>
                    <div style={{ fontFamily: "monospace", fontSize: "8px", color: "#777", letterSpacing: "0.15em" }}>ADMIN</div>
                </div>
                <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #333", color: "#aaa", padding: "7px 14px", fontFamily: "monospace", fontSize: "9px", cursor: "pointer" }}>LOG OUT</button>
            </div>
            <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px" }}>
                <StatsBar posts={[]} users={[]} airdrops={[]} subscribers={[]} />
                <TabBar active={tab} onChange={setTab} />
                {tab === "airdrops" && <AirdropsTab />}
                {tab === "newsletter" && <NewsletterSendTab />}
                {tab === "subscribers" && <SubscribersTab isuser={false} />}
                {tab === "users" && <SubscribersTab isuser={true} />}
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
        adminGet<Subscriber[]>("subscribers", 500)
            .then(data => setSubscribers((data || []).filter(s => s.subscribed)))
            .catch(error => console.error("Failed to load subscribers for newsletter tab:", error))
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

        try {
            const safeBody = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
            const result = await adminSendNewsletter<{ successCount: number; failureCount: number; total: number; message: string }>({
                subject,
                content: `<p>${safeBody}</p>`,
                topic: selectedTopic,
            });
            setStatus(`✓ ${result.message} (${result.successCount}/${result.total})`);
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Newsletter send failed.");
        } finally {
            setSending(false);
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
        adminGet<Airdrop[]>("airdrops", 500)
            .then(data => updateDrop(data || []))
            .catch(error => setListStatus(error instanceof Error ? error.message : "Failed to load airdrops."))
            .finally(() => setLoading(false))
    }, [])

    async function handleAdd() {
        if (!form.name.trim() || !form.reward_amount.trim()) { setListStatus("Name and reward required."); return; }
        setSaving(true);

        if (editingId) {
            // Editing an existing listing
            try {
                const rows = await adminPatch<Airdrop[]>("airdrops", editingId, { ...form });
                const updated = Array.isArray(rows) ? rows[0] : rows;
                if (updated) onUpdate(updated as Airdrop);
            } catch (error) {
                setSaving(false);
                setListStatus(error instanceof Error ? error.message : "Update failed.");
                return;
            }
            setSaving(false);
            setForm(emptyForm);
            setEditingId(null);
            setAdding(false); setListStatus("✓ Airdrop updated.");
            setTimeout(() => setListStatus(""), 3000);
            return;
        }

        // Adding a brand new listing
        try {
            const rows = await adminPost<Airdrop[]>("airdrops", { ...form, status: "live" });
            const created = Array.isArray(rows) ? rows[0] : rows;
            if (created) onAdd(created as Airdrop);
        } catch (error) {
            setSaving(false);
            setListStatus(error instanceof Error ? error.message : "Save failed.");
            return;
        }
        setSaving(false);
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
        try {
            await adminDelete("airdrops", id);
            onRemove(id);
        } catch (error) {
            setListStatus(error instanceof Error ? error.message : "Delete failed.");
        }
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
        adminGet<Subscriber[]>(isuser ? "farmer_profiles" : "subscribers", 500)
            .then(data => setSubscribers((data || []) as Subscriber[]))
            .catch(error => console.error("Failed to load records:", error))
    }, [])
    async function handleRemove(id: string) {
        try {
            await adminPatch("subscribers", id, { subscribed: false });
            onRemove(id);
        } catch (error) {
            console.error("Unsubscribe failed:", error);
        }
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
                                            <div style={{ fontFamily: "mono", fontSize: "8px", color: s.subscribed ? "#c8ff00" : "#ff7777", letterSpacing: "0.1em", marginBottom: "5px" }}>{s.subscribed ? "ACTIVE SUBSCRIBER" : "UNSUBSCRIBED"}</div>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
                                                {(s.topics || []).map(t => <span key={t} style={{ fontFamily: "mono", fontSize: "8px", color: "#c8ff00", border: "1px solid #c8ff00", padding: "1px 7px", letterSpacing: "0.08em" }}>{t}</span>)}
                                            </div>
                                            <div style={{ fontFamily: "mono", fontSize: "8px", color: "#2a2a2a", letterSpacing: "0.1em" }}>{s.frequency} · {(s.created_at ? (s.created_at ? new Date(s.created_at).toLocaleDateString() : '—') : '')}</div>
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
                                            <div style={{ fontFamily: "mono", fontSize: "8px", color: "#2a2a2a", letterSpacing: "0.1em" }}>{s.frequency} · {(s.created_at ? new Date(s.created_at).toLocaleDateString() : '—')}</div>
                                        </div>
                                            {s.subscribed && <button onClick={() => handleRemove(s.id)} style={{ background: "transparent", color: "#ff4d4d", border: "1px solid #ff4d4d", padding: "4px 10px", fontFamily: "mono", fontSize: "8px", cursor: "pointer" }}>UNSUBSCRIBE</button>}
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