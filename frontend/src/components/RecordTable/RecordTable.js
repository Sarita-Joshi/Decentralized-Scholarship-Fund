import React from 'react';
import './RecordTable.css';

function RecordTable({ data, columns, actions, headers }) {
    if (!headers) {
        headers = columns;
    }
    return (
        <div className="table-container">
            <table className="record-table">
                <thead>
                    <tr>
                        {headers.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                        {actions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((col) => (
                                <td key={col}>{row[col]}</td>
                            ))}
                            {actions && (
                                <td>
                                    { (row["status"] && row["status"]==="Pending") && actions.map((action, actionIndex) => (
                                        <button
                                            key={actionIndex}
                                            onClick={() => action.onClick(row)}
                                            className="action-button"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RecordTable;
