//const { response } = require("express")
//const { join } = require("path")

const JOB_API_LINK = "https://improved-guide-q765wg9pp75p2g54-5001.app.github.dev/Jobs"

fetch(JOB_API_LINK).then(response=>{
    if(!response.ok){
        throw new Error("Error fetching Data");
    }
    return response.json();
}).then(data=>{
     const tbody = document.querySelector("#jobTable tbody")
     data.forEach(job=>{
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${job.job_id}</td>
        <td>${job.job_title}</td>
        <td>${job.min_salary}</td>
        <td>${job.max_salary}</td>
        `;

        tbody.appendChild(row);
     })
}).catch(err=>{
    console.log(err.message);
});