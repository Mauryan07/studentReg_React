import React, { useState } from 'react'
import Card from './Card.jsx'

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function Registrations({
                                          courses,
                                          courseTypes,
                                          offerings,
                                          registrations,
                                          setRegistrations
                                      }) {
    const [filterType, setFilterType] = useState('all')
    const [open, setOpen] = useState({})
    const [forms, setForms] = useState({})
    const [errors, setErrors] = useState({})

    function typeName(id) {
        const t = courseTypes.find(x => x.id === id)
        return t ? t.name : 'Unknown'
    }
    function courseName(id) {
        const c = courses.find(x => x.id === id)
        return c ? c.name : 'Unknown'
    }

    function setForm(offeringId, patch) {
        const prev = forms[offeringId] || { name: '', email: '' }
        setForms({ ...forms, [offeringId]: { ...prev, ...patch } })
    }

    function regsFor(offeringId) {
        return registrations.filter(r => r.offeringId === offeringId)
    }

    function register(offeringId, e) {
        e.preventDefault()
        setErrors({ ...errors, [offeringId]: '' })
        const f = forms[offeringId] || { name: '', email: '' }
        const name = (f.name || '').trim()
        const email = (f.email || '').trim().toLowerCase()
        if (!name) { setErrors({ ...errors, [offeringId]: 'Name required' }); return }
        const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!okEmail) { setErrors({ ...errors, [offeringId]: 'Valid email required' }); return }
        const dupe = registrations.some(r => r.offeringId === offeringId && r.email.toLowerCase() === email)
        if (dupe) { setErrors({ ...errors, [offeringId]: 'Already registered' }); return }

        setRegistrations([...registrations, { id: uid(), offeringId, name, email }])
        setForms({ ...forms, [offeringId]: { name: '', email: '' } })
        setOpen({ ...open, [offeringId]: true })
    }

    function unregister(offeringId, regId) {
        if (!confirm('Remove this registration?')) return
        setRegistrations(registrations.filter(r => !(r.offeringId === offeringId && r.id === regId)))
    }

    const visibleOfferings = offerings.filter(o => filterType === 'all' ? true : o.typeId === filterType)

    return (
        <Card
            title="Student Registrations"
            right={
                <div className="flex items-center gap-2">
                    <span className="text-sm opacity-70">Filter:</span>
                    <select className="select select-bordered select-sm" value={filterType} onChange={e=>setFilterType(e.target.value)}>
                        <option value="all">All</option>
                        {courseTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            }
        >
            <div className="space-y-3">
                {visibleOfferings.length === 0 && (
                    <div className="alert"><span>No offerings available. Create offerings first.</span></div>
                )}

                {visibleOfferings.map(o => {
                    const regs = regsFor(o.id)
                    return (
                        <div key={o.id} className="card bg-base-100 shadow">
                            <div className="card-body gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{typeName(o.typeId)} — {courseName(o.courseId)}</div>
                                        <div className="text-sm opacity-70">{regs.length} registered</div>
                                    </div>
                                    <button className="btn btn-outline btn-sm" onClick={()=>setOpen({ ...open, [o.id]: !open[o.id] })}>
                                        {open[o.id] ? 'Hide Students' : 'View Students'}
                                    </button>
                                </div>

                                {open[o.id] && (
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
                                            <tbody>
                                            {regs.length === 0 && (
                                                <tr><td colSpan={3} className="text-center text-base-content/60">No students yet.</td></tr>
                                            )}
                                            {regs.map(r => (
                                                <tr key={r.id}>
                                                    <td>{r.name}</td>
                                                    <td>{r.email}</td>
                                                    <td>
                                                        <button className="btn btn-xs btn-error" onClick={()=>unregister(o.id, r.id)}>Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <form className="grid grid-cols-1 md:grid-cols-3 gap-2" onSubmit={(e)=>register(o.id, e)}>
                                    <input
                                        className="input input-bordered w-full"
                                        placeholder="Student name"
                                        value={forms[o.id]?.name || ''}
                                        onChange={e=>setForm(o.id, { name: e.target.value })}
                                        required
                                    />
                                    <input
                                        className="input input-bordered w-full"
                                        type="email"
                                        placeholder="Student email"
                                        value={forms[o.id]?.email || ''}
                                        onChange={e=>setForm(o.id, { email: e.target.value })}
                                        required
                                    />
                                    <button className="btn btn-primary">Register</button>
                                </form>
                                {errors[o.id] && <div className="alert alert-error"><span>{errors[o.id]}</span></div>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}