import React, { useState } from 'react'
import Card from './Card.jsx'

export default function Offerings({
                                      courses,
                                      courseTypes,
                                      offerings,
                                      setOfferings,
                                      registrations,
                                      setRegistrations
                                  }) {
    const [filterType, setFilterType] = useState('all')
    const [form, setForm] = useState({ typeId: '', courseId: '' })
    const [edit, setEdit] = useState(null)
    const [error, setError] = useState('')

    const list = offerings.filter(o => filterType === 'all' ? true : o.typeId === filterType)

    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2)
    }

    function addOrUpdate(e) {
        e.preventDefault()
        setError('')
        if (edit) {
            if (!edit.typeId || !edit.courseId) { setError('Select both'); return }
            const dupe = offerings.some(o => o.id !== edit.id && o.typeId === edit.typeId && o.courseId === edit.courseId)
            if (dupe) { setError('Offering already exists'); return }
            setOfferings(offerings.map(o => o.id === edit.id ? { ...o, typeId: edit.typeId, courseId: edit.courseId } : o))
            setEdit(null)
        } else {
            if (!form.typeId || !form.courseId) { setError('Select both'); return }
            const dupe = offerings.some(o => o.typeId === form.typeId && o.courseId === form.courseId)
            if (dupe) { setError('Offering already exists'); return }
            setOfferings([...offerings, { id: uid(), typeId: form.typeId, courseId: form.courseId }])
            setForm({ typeId: '', courseId: '' })
        }
    }

    function removeOffering(id) {
        if (!confirm('Delete this offering?')) return
        setRegistrations(registrations.filter(r => r.offeringId !== id))
        setOfferings(offerings.filter(o => o.id !== id))
    }

    function typeName(id) {
        const t = courseTypes.find(x => x.id === id)
        return t ? t.name : 'Unknown'
    }
    function courseName(id) {
        const c = courses.find(x => x.id === id)
        return c ? c.name : 'Unknown'
    }

    return (
        <Card
            title="Manage Course Offerings"
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
            <form className="flex flex-col md:flex-row gap-2" onSubmit={addOrUpdate}>
                <select
                    className="select select-bordered w-full"
                    value={edit ? edit.typeId : form.typeId}
                    onChange={e => edit ? setEdit({ ...edit, typeId: e.target.value }) : setForm({ ...form, typeId: e.target.value })}
                >
                    <option value="">Select Course Type</option>
                    {courseTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select
                    className="select select-bordered w-full"
                    value={edit ? edit.courseId : form.courseId}
                    onChange={e => edit ? setEdit({ ...edit, courseId: e.target.value }) : setForm({ ...form, courseId: e.target.value })}
                >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button className="btn btn-primary">{edit ? 'Update' : 'Add Offering'}</button>
                {edit && <button type="button" className="btn" onClick={()=>setEdit(null)}>Cancel</button>}
            </form>
            {error && <div className="alert alert-error mt-2"><span>{error}</span></div>}

            <div className="overflow-x-auto mt-4">
                <table className="table">
                    <thead><tr><th>Course Type</th><th>Course</th><th>Actions</th></tr></thead>
                    <tbody>
                    {list.map(o => (
                        <tr key={o.id}>
                            <td><span className="badge">{typeName(o.typeId)}</span></td>
                            <td>{courseName(o.courseId)}</td>
                            <td className="flex gap-2">
                                <button className="btn btn-sm" onClick={()=>setEdit({ id: o.id, typeId: o.typeId, courseId: o.courseId })}>Edit</button>
                                <button className="btn btn-sm btn-error" onClick={()=>removeOffering(o.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {list.length === 0 && (
                        <tr><td colSpan={3} className="text-center text-base-content/60">No offerings.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}