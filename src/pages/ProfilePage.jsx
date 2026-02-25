import React, { useState, useRef } from 'react';
import {
    User, Camera, Plus, Trash2, ChevronDown, ChevronUp,
    FileText, AlertCircle, Pill, Heart, Thermometer, Save,
} from 'lucide-react';

/* ── Helpers ──────────────────────────────────────────────────── */
function SectionCard({ title, icon, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ background: '#FFF', border: '1px solid var(--border)', borderRadius: '14px', marginBottom: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <button onClick={() => setOpen(o => !o)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {icon}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A2233' }}>{title}</span>
                </div>
                {open ? <ChevronUp size={16} color="#A0ABBE" /> : <ChevronDown size={16} color="#A0ABBE" />}
            </button>
            {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
        </div>
    );
}

function Field({ label, type = 'text', value, onChange, placeholder, multiline }) {
    const common = {
        width: '100%', padding: '10px 12px', borderRadius: '10px',
        border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.82rem',
        fontFamily: 'var(--font-main)', color: '#1A2233',
        background: '#FAFBFD', outline: 'none', resize: 'none',
        boxSizing: 'border-box',
    };
    return (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#5A6880', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>
                {label}
            </label>
            {multiline
                ? <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} style={common} />
                : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={common} />
            }
        </div>
    );
}

function TagInput({ label, tags, setTags }) {
    const [input, setInput] = useState('');
    const add = () => {
        const v = input.trim();
        if (v && !tags.includes(v)) setTags(t => [...t, v]);
        setInput('');
    };
    return (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#5A6880', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>
                {label}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                {tags.map(t => (
                    <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.72rem', color: '#2563EB', fontWeight: 600 }}>
                        {t}
                        <button onClick={() => setTags(ts => ts.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#2563EB', display: 'flex' }}>
                            <Trash2 size={11} />
                        </button>
                    </span>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
                <input
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && add()}
                    placeholder="Type & press Enter or +"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.78rem', fontFamily: 'var(--font-main)', background: '#FAFBFD', outline: 'none' }}
                />
                <button onClick={add} style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--blue)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
}

/* ── Prescription card ─────────────────────────────────────────── */
function PrescriptionCard({ rx, onRemove }) {
    return (
        <div style={{ background: '#FAFBFD', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            {rx.dataUrl
                ? <img src={rx.dataUrl} alt="prescription" style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', flexShrink: 0 }} />
                : <div style={{ width: '56px', height: '72px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={22} color="#2563EB" />
                </div>
            }
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A2233' }}>{rx.name}</p>
                <p style={{ fontSize: '0.68rem', color: '#5A6880', marginTop: '2px' }}>Dr. {rx.doctor}</p>
                <p style={{ fontSize: '0.65rem', color: '#A0ABBE', marginTop: '2px' }}>{rx.date}</p>
                {rx.notes && <p style={{ fontSize: '0.65rem', color: '#5A6880', marginTop: '4px', fontStyle: 'italic' }}>"{rx.notes}"</p>}
            </div>
            <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
                <Trash2 size={14} color="#A0ABBE" />
            </button>
        </div>
    );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function ProfilePage({ user = null }) {
    const fileRef = useRef(null);
    const [saved, setSaved] = useState(false);

    // Personal info – pre-populate from sign-up if available
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [blood, setBlood] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    // Medical history
    const [conditions, setConditions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [medications, setMedications] = useState([]);
    const [surgeries, setSurgeries] = useState('');
    const [familyHist, setFamilyHist] = useState('');
    const [emergContact, setEmergContact] = useState('');
    const [emergPhone, setEmergPhone] = useState('');
    const [notes, setNotes] = useState('');

    // Prescriptions
    const [prescriptions, setPrescriptions] = useState([]);
    const [rxForm, setRxForm] = useState({ name: '', doctor: '', date: '', notes: '', dataUrl: null });
    const [addingRx, setAddingRx] = useState(false);

    const handlePhotoUpload = e => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => setRxForm(r => ({ ...r, dataUrl: ev.target.result }));
        reader.readAsDataURL(f);
    };

    const addPrescription = () => {
        if (!rxForm.name) return;
        setPrescriptions(p => [...p, { ...rxForm, id: Date.now() }]);
        setRxForm({ name: '', doctor: '', date: '', notes: '', dataUrl: null });
        setAddingRx(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2400);
    };

    const bloodTypes = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

    return (
        <div style={{ padding: '0 0 32px', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div style={{ padding: '18px 20px 16px', background: '#FFF', borderBottom: '1px solid var(--border)', marginBottom: '14px' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>SAVR</p>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '1px' }}>My Profile</h1>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <User size={28} color="#2563EB" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1A2233' }}>{name || 'Your Name'}</p>
                        {email && (
                            <p style={{ fontSize: '0.7rem', color: '#2563EB', marginTop: '1px', fontWeight: 600 }}>{email}</p>
                        )}
                        <p style={{ fontSize: '0.7rem', color: '#5A6880', marginTop: '2px' }}>
                            {blood ? `Blood: ${blood}` : ''}{blood && height ? ' · ' : ''}{height ? `${height} cm` : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 14px' }}>
                {/* ── Personal Information ───────────────────────────── */}
                <SectionCard title="Personal Information" icon={<User size={16} color="#2563EB" />}>
                    <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun Sharma" />
                    {email && (
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#5A6880', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Email Address</label>
                            <div style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.82rem', fontFamily: 'var(--font-main)', color: '#2563EB', background: 'rgba(37,99,235,0.04)', fontWeight: 600, boxSizing: 'border-box' }}>{email}</div>
                        </div>
                    )}
                    <Field label="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} type="date" />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Gender</label>
                            <select value={gender} onChange={e => setGender(e.target.value)} style={selectStyle}>
                                <option value="">Select</option>
                                {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Blood Group</label>
                            <select value={blood} onChange={e => setBlood(e.target.value)} style={selectStyle}>
                                <option value="">Select</option>
                                {bloodTypes.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}><Field label="Height (cm)" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" /></div>
                        <div style={{ flex: 1 }}><Field label="Weight (kg)" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="65" /></div>
                    </div>
                    <Field label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </SectionCard>

                {/* ── Medical History ────────────────────────────────── */}
                <SectionCard title="Medical History" icon={<Heart size={16} color="#DC2626" />}>
                    <TagInput label="Existing Conditions" tags={conditions} setTags={setConditions} />
                    <TagInput label="Known Allergies" tags={allergies} setTags={setAllergies} />
                    <TagInput label="Current Medications" tags={medications} setTags={setMedications} />
                    <Field label="Past Surgeries / Procedures" value={surgeries} onChange={e => setSurgeries(e.target.value)} placeholder="e.g. Appendectomy 2019, Knee surgery 2021..." multiline />
                    <Field label="Family Medical History" value={familyHist} onChange={e => setFamilyHist(e.target.value)} placeholder="e.g. Father: Hypertension, Mother: Type 2 Diabetes..." multiline />
                </SectionCard>

                {/* ── Emergency Contact ──────────────────────────────── */}
                <SectionCard title="Emergency Contact" icon={<AlertCircle size={16} color="#D97706" />} defaultOpen={false}>
                    <Field label="Contact Name" value={emergContact} onChange={e => setEmergContact(e.target.value)} placeholder="e.g. Priya Sharma" />
                    <Field label="Phone Number" type="tel" value={emergPhone} onChange={e => setEmergPhone(e.target.value)} placeholder="+91 98765 43210" />
                </SectionCard>

                {/* ── Prescriptions ──────────────────────────────────── */}
                <SectionCard title="Prescriptions & Medical Records" icon={<FileText size={16} color="#6D4ADE" />}>
                    {prescriptions.map(rx => (
                        <PrescriptionCard key={rx.id} rx={rx} onRemove={() => setPrescriptions(p => p.filter(x => x.id !== rx.id))} />
                    ))}

                    {!addingRx ? (
                        <button onClick={() => setAddingRx(true)} style={{
                            width: '100%', padding: '12px', borderRadius: '12px',
                            border: '1.5px dashed rgba(109,74,222,0.35)', background: 'rgba(109,74,222,0.04)',
                            color: '#6D4ADE', fontFamily: 'var(--font-main)', fontWeight: 700,
                            fontSize: '0.82rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}>
                            <Camera size={16} /> Add Prescription Photo
                        </button>
                    ) : (
                        <div style={{ background: '#FAFBFD', border: '1px solid rgba(109,74,222,0.2)', borderRadius: '12px', padding: '14px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A2233', marginBottom: '10px' }}>New Prescription</p>

                            {/* Photo upload */}
                            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                            <button onClick={() => fileRef.current.click()} style={{
                                width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '10px',
                                border: '1.5px dashed rgba(37,99,235,0.3)', background: rxForm.dataUrl ? 'transparent' : 'rgba(37,99,235,0.04)',
                                cursor: 'pointer', overflow: 'hidden',
                            }}>
                                {rxForm.dataUrl
                                    ? <img src={rxForm.dataUrl} alt="preview" style={{ width: '100%', maxHeight: '140px', objectFit: 'contain', borderRadius: '8px' }} />
                                    : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px 0' }}>
                                        <Camera size={24} color="#2563EB" />
                                        <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600, fontFamily: 'var(--font-main)' }}>Tap to upload photo</span>
                                    </div>
                                }
                            </button>

                            <Field label="Prescription Name / Medication" value={rxForm.name} onChange={e => setRxForm(r => ({ ...r, name: e.target.value }))} placeholder="e.g. Metoprolol 50mg" />
                            <Field label="Prescribed By (Doctor)" value={rxForm.doctor} onChange={e => setRxForm(r => ({ ...r, doctor: e.target.value }))} placeholder="e.g. Dr. Verma" />
                            <Field label="Date" value={rxForm.date} onChange={e => setRxForm(r => ({ ...r, date: e.target.value }))} type="date" />
                            <Field label="Notes (Optional)" value={rxForm.notes} onChange={e => setRxForm(r => ({ ...r, notes: e.target.value }))} placeholder="Dosage, frequency..." multiline />

                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <button onClick={() => setAddingRx(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F4F7FB', border: '1px solid var(--border)', color: '#5A6880', fontFamily: 'var(--font-main)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                                    Cancel
                                </button>
                                <button onClick={addPrescription} style={{ flex: 2, padding: '10px', borderRadius: '10px', background: '#6D4ADE', border: 'none', color: '#fff', fontFamily: 'var(--font-main)', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', boxShadow: '0 4px 12px rgba(109,74,222,0.3)' }}>
                                    Save Prescription
                                </button>
                            </div>
                        </div>
                    )}
                </SectionCard>

                {/* ── Additional Notes ───────────────────────────────── */}
                <SectionCard title="Additional Notes" icon={<Pill size={16} color="#12A37A" />} defaultOpen={false}>
                    <Field label="Lifestyle / Dietary Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Vegetarian, intermittent fasting, no alcohol..." multiline />
                </SectionCard>

                {/* Save button */}
                <button onClick={handleSave} style={{
                    width: '100%', padding: '14px', borderRadius: '14px',
                    background: saved ? '#12A37A' : '#2563EB', border: 'none',
                    color: '#fff', fontFamily: 'var(--font-main)', fontWeight: 700,
                    fontSize: '0.95rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: saved ? '0 4px 14px rgba(18,163,122,0.35)' : '0 4px 14px rgba(37,99,235,0.3)',
                    transition: 'all 0.3s ease', marginTop: '4px',
                }}>
                    <Save size={17} color="#fff" />
                    {saved ? 'Profile Saved ✓' : 'Save Profile'}
                </button>
            </div>
        </div>
    );
}

/* ── Shared micro-styles ──────────────────────────────────────── */
const labelStyle = { fontSize: '0.68rem', fontWeight: 700, color: '#5A6880', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' };
const selectStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.82rem',
    fontFamily: 'var(--font-main)', color: '#1A2233',
    background: '#FAFBFD', outline: 'none', marginBottom: '10px',
    appearance: 'none', boxSizing: 'border-box',
};
