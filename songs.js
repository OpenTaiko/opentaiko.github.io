let Songlist;

function GetSongsByGenre(genre) {return Songlist.filter(song => song["tjaGenreFolder"] === genre)}

function show_songs(genre, classname) {
    let text = "";

    GetSongsByGenre(genre).forEach(song => {
        text += "<div>"
        text += "<h3>" + song["chartTitle"] + "</h3>"
        text += "<h4>" + song["chartSubtitle"] + "</h4>"
        text += "<span>Easy: " + song["chartDifficulties"]["Easy"] + " / Normal: "
        + song["chartDifficulties"]["Normal"] + " / Hard: "
        + song["chartDifficulties"]["Hard"] + " / Extreme: "
        + song["chartDifficulties"]["Oni"] +
        (song["chartDifficulties"]["Edit"] ? ( " / Extra: " + song["chartDifficulties"]["Edit"]) : "")
        + "</span>"
        text += "<div><audio controls muted preload='none'><source src='https://github.com/OpenTaiko/OpenTaiko-Soundtrack/raw/refs/heads/main/" + song['chartAudioFilePath'] + "'></audio></div>"
        text += "</div>"
    })

    document.getElementById("songs").innerHTML = text;
    document.getElementById("songs").childNodes.forEach(node => {node.className = classname})
}

async function fetch_songs() {
        let songs_text = (await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json"))
        let text = (await songs_text.text()).valueOf()
        Songlist = JSON.parse(text);
}

async function first_setup() {
    await fetch_songs();
    console.log("Songlist:")
    console.log(Songlist)
    show_songs("04 OpenTaiko Chapter IV", "ch4");
}

first_setup()