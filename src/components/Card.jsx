import React from 'react'

export default function Card({ title, right, children }) {
    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <div className="flex items-center justify-between">
                    <h2 className="card-title">{title}</h2>
                    {right}
                </div>
                {children}
            </div>
        </div>
    )
}