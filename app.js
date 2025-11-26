const PASSWORT = "wohnmobil2024";

function checkPassword() {
    let pw = document.getElementById("password").value;
    if (pw === PASSWORT) {
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
        ladeReisen();
    } else {
        alert("Falsches Passwort!");
    }
}

async function ladeReisen() {
    let reisenListe = document.getElementById("reisen-liste");
    let response = await fetch("data/reisen.json");
    let reisen = await response.json();

    reisen.forEach(reise => {
        let btn = document.createElement("button");
        btn.textContent = reise.titel;
        btn.onclick = () => ladeReiseDetails(reise.pfad);
        reisenListe.appendChild(btn);
    });
}

async function ladeReiseDetails(pfad) {
    let response = await fetch(`data/reisen/${pfad}/reise.json`);
    let reise = await response.json();

    document.getElementById("reise-titel").textContent = reise.titel;

    let map = L.map("karte").setView(reise.route[0], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    let routeLine = L.polyline(reise.route, {color: 'blue'}).addTo(map);
    map.fitBounds(routeLine.getBounds());

    let logsContainer = document.getElementById("logs");
    logsContainer.innerHTML = "";

    for (let i = 0; i < reise.logs.length; i++) {
        let logResp = await fetch(`data/reisen/${pfad}/logs/${reise.logs[i]}.json`);
        let log = await logResp.json();

        let div = document.createElement("div");
        div.innerHTML = `<h3>${log.titel} (${log.datum}) – von ${log.autor}</h3><p>${log.text}</p>`;
        log.bilder.forEach(b => {
            let img = document.createElement("img");
            img.src = `data/reisen/${pfad}/fotos/${b}`;
            div.appendChild(img);
        });
        logsContainer.appendChild(div);
    }

    document.getElementById("zusammenfassung").textContent = reise.zusammenfassung;
    document.getElementById("reise-detail").style.display = "block";
}
