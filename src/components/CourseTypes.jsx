import React, { useState } from 'react'
import Card from './Card.jsx'

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function CourseTypes({
                                        courseTypes,
                                        setCourseTypes,
                                        offerings,
                                        setOfferings,
                                        registrations,
                                        setRegistrations
                                    }) {
    const [name, setName] = useState('')
    const [edit, setEdit] = useState(null)
    const [error, setError] = useState('')

    function addOrUpdate(e) {
        e.preventDefault()
        setError('')
        const n = (edit ? edit.name : name).trim()
        if (!n) { setError('Name required'); return }
        const duplicate = courseTypes.some(t => t.name.toLowerCase() === n.toLowerCase() && (!edit || t.id !== edit.id))
        if (duplicate) { setError('Already exists'); return }

        if (edit) {
            setCourseTypes(courseTypes.map(t => t.id === edit.id ? { ...t, name: n } : t))
            setEdit(null)
        } else {
            setCourseTypes([...courseTypes, { id: uid(), name: n }])
            setName('')
        }
    }

    function removeType(id) {
        if (!confirm('Delete this course type? Related offerings and registrations will be removed.')) return
        const removedOfferingIds = offerings.filter(o => o.typeId === id).map(o => o.id)
        setOfferings(offerings.filter(o => o.typeId !== id))
        setRegistrations(registrations.filter(r => !removedOfferingIds.includes(r.offeringId)))
        setCourseTypes(courseTypes.filter(t => t.id !== id))
    }

    return (
        <Card title="Manage Course Types">
            <form className="flex gap-2 items-center" onSubmit={addOrUpdate}>
                <input
                    className="input input-bordered w-full"
                    placeholder="e.g., Individual"
                    value={edit ? edit.name : name}
                    onChange={e => edit ? setEdit({ ...edit, name: e.target.value }) : setName(e.target.value)}
                />
                <button className="btn btn-primary">{edit ? 'Update' : 'Add'}</button>
                {edit && <button type="button" className="btn" onClick={()=>setEdit(null)}>Cancel</button>}
            </form>
            {error && <div className="alert alert-error mt-2"><span>{error}</span></div>}

            <div className="overflow-x-auto mt-4">
                <table className="table">
                    <thead><tr><th>Name</th><th>Actions</th></tr></thead>
                    <tbody>
                    {courseTypes.map(t => (
                        <tr key={t.id}>
                            <td>{t.name}</td>
                            <td className="flex gap-2">
                                <button className="btn btn-sm" onClick={()=>setEdit({ id: t.id, name: t.name })}>Edit</button>
                                <button className="btn btn-sm btn-error" onClick={()=>removeType(t.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {courseTypes.length === 0 && (
                        <tr><td colSpan={2} className="text-center text-base-content/60">No course types yet.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}