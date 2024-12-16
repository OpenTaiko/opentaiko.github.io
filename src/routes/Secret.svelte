<script>
    import Button from "../components/Button.svelte";

    const setColor = () => {
        document.getElementById("secret").style.backgroundColor = "white"
    }

    const getSecret = async () => {
        const secret = document.getElementById("secret").value;
        if (secret === "" || !secret) return;

        const secret_value = btoa(secret).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

        const url = "https://opentaiko.neocities.org/" + secret_value + ".zip"
        const response = await fetch(url, { method: "HEAD" });

        if (response.ok) {
            console.log("Secret found!");
            document.getElementById("secret").style.backgroundColor = "rgb(150,255,150)";
            setTimeout(setColor, 2000);
            return url;
        }
        else {
            console.log("Secret not found. Created '" + secret_value + "' from '" + secret + "'.");
            document.getElementById("secret").style.backgroundColor = "rgb(255,150,150)";
            setTimeout(setColor, 2000);
            return;
        }
    }

    const fetchSecret = async () => {
        const url = await getSecret();

        if (url) {
            const downloadurl = document.createElement("a");
            downloadurl.href = url;
            downloadurl.target = "_blank";
            downloadurl.click();
        }
    }
</script>

<div class="content">
    <div class="collection">
        <form>
            <input type="text" id="secret" name="secret">
        </form>
        <div style="width:fit-content;margin:auto;">
            <Button
                color1={'white'}
                color2={'white'}
                textColor={'black'}
                text={'???'}
                OnClick={fetchSecret}
            />
        </div>
    </div>
</div>

<style>
    .content {
        float: right;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0px;
        background-color: rgb(0,0,0);

        display:flex;
        align-content: center;
        vertical-align: middle;
    }
    .collection {
        margin:auto;
    }
</style>