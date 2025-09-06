import React, { useState } from 'react'
import CourseTypes from './components/CourseTypes.jsx'
import Offerings from './components/Offerings.jsx'
import Registrations from './components/Registrations.jsx'


function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const COURSES = [
    { id: 'c_en', name: 'English' },
    { id: 'c_hi', name: 'Hindi' },
    { id: 'c_ur', name: 'Urdu' },
]

export default function App() {
    const [tab, setTab] = useState('types')

    const [courseTypes, setCourseTypes] = useState([
        { id: uid(), name: 'Individual' },
        { id: uid(), name: 'Group' },
        { id: uid(), name: 'Special' },
    ])

    const [offerings, setOfferings] = useState([]) // {id, typeId, courseId}
    const [registrations, setRegistrations] = useState([]) // {id, offeringId, name, email}

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-5xl mx-auto p-4 space-y-4">
                <div className="navbar bg-base-100 rounded-lg shadow">
                    <div className="flex-1">
                        <span className="text-lg font-bold px-2">Student Registration</span>
                    </div>
                </div>

                <div role="tablist" className="tabs tabs-boxed">
                    <button role="tab" className={`tab ${tab==='types' ? 'tab-active' : ''}`} onClick={()=>setTab('types')}>Course Types</button>
                    <button role="tab" className={`tab ${tab==='offerings' ? 'tab-active' : ''}`} onClick={()=>setTab('offerings')}>Offerings</button>
                    <button role="tab" className={`tab ${tab==='registrations' ? 'tab-active' : ''}`} onClick={()=>setTab('registrations')}>Registrations</button>
                </div>

                {tab === 'types' && (
                    <CourseTypes
                        courseTypes={courseTypes}
                        setCourseTypes={setCourseTypes}
                        offerings={offerings}
                        setOfferings={setOfferings}
                        registrations={registrations}
                        setRegistrations={setRegistrations}
                    />
                )}

                {tab === 'offerings' && (
                    <Offerings
                        courses={COURSES}
                        courseTypes={courseTypes}
                        offerings={offerings}
                        setOfferings={setOfferings}
                        registrations={registrations}
                        setRegistrations={setRegistrations}
                    />
                )}

                {tab === 'registrations' && (
                    <Registrations
                        courses={COURSES}
                        courseTypes={courseTypes}
                        offerings={offerings}
                        registrations={registrations}
                        setRegistrations={setRegistrations}
                    />
                )}
            </div>
        </div>
    )
}