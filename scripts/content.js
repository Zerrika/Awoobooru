function Awoobooru() {
    console.info("Awooo!");
	reload_settings(null);
    let posts = $("#posts article");

    for (let i = 0; i < posts.length; i++) {
		$.get(`${window.location.origin}/posts/${posts[i].dataset.id}.json`, function(data){
			let extras = document.createElement("div");
			extras.className = "awoo awoo-extras";

			let preview = document.createElement("a");
			preview.className = "awoo-preview";
			preview.innerHTML = "Preview";
			preview.dataset.preview = data.large_file_url;
			preview.dataset.url = data.file_url;
			preview.dataset.md5 = data.md5;
			preview.dataset.ext = data.file_ext;
			preview.dataset.width = data.image_width;
			preview.dataset.height = data.image_height;
			preview.dataset.id = data.id;

			preview.addEventListener("click", (e) => {
				if ($(e.target.parentElement).find(".modal[id^='awoo-preview-modal']").length < 1) {
					let img = document.createElement("img");
					img.className = "awoo";
					img.src = e.target.dataset.preview;
		
					let modal = generate_modal({
						title: `<a href="${e.target.dataset.url}" 
									download="${e.target.dataset.md5 + "." + e.target.dataset.ext}">
									${e.target.dataset.md5 + "." + e.target.dataset.ext}</a> 
									(${e.target.dataset.width + " x " + e.target.dataset.height})`,
						id: "awoo-preview-modal-" + e.target.dataset.id
					});
		
					$(modal).find(".modal-body").append(img);
		
					e.target.parentElement.appendChild(modal);
				}

				$("#awoo-preview-modal-" + e.target.dataset.id).modal("toggle");
			});

			let sep0 = document.createElement("span");
			sep0.className = "awoo-sep0";
			sep0.innerHTML = "|";

			let download = document.createElement("a");
			download.className = "awoo-download";
			download.innerHTML = "Download";
			download.href = data.file_url;
			download.download = data.md5 + "." + data.file_ext;

			extras.appendChild(preview);
			extras.appendChild(sep0);
			extras.appendChild(download);

			posts[i].appendChild(extras);
			reload_settings(null);
		});
    }
}

function generate_modal(options = {}) {
    let root = document.createElement("div");
    root.className = "modal";
    if (options.id !== undefined) {
        root.id = options.id;
    }

    let dialog = document.createElement("div");
    dialog.className = "modal-dialog";

    let content = document.createElement("div");
    content.className = "modal-content";

    let header = document.createElement("div");
    header.className = "modal-header";

    let title = document.createElement("h6");
    title.class = "modal-title";
    if (options.title !== undefined) {
        title.innerHTML = options.title;
    }
    
    let close = document.createElement("button");
    close.className = "close"
    close.type = "button";
    close.dataset.bsDismiss = "modal";
    close.innerHTML = "&times;";

    header.appendChild(title);
    header.appendChild(close);

    content.appendChild(header);

    let body = document.createElement("div");
    body.className = "modal-body";

    content.appendChild(body);
    dialog.appendChild(content);
    root.appendChild(dialog);

    return root;
}

function reload_settings(settings) {
    browser.storage.local.get(
    settings,
    function(items) {
        console.info("(Re)loaded settings:", items);

        if (items.dark_theme) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }

        if (items.preview_button || items.download_button) {
            if ($("#awoobooru-style-override").length < 1) {
                let style = document.createElement("style");
                style.id = "awoobooru-style-override";
                style.innerHTML = "article.post-preview { height: 178px !important; }";

                document.head.appendChild(style);
            }
        } else {
            $("#awoobooru-style-override").remove();
        }

        if (items.preview_button) {
            $(".awoo-preview").css("display", "inline");
        } else {
            $(".awoo-preview").css("display", "none");
        }

        if (items.download_button) {
            $(".awoo-download").css("display", "inline");
        } else {
            $(".awoo-download").css("display", "none");
        }

        if (items.preview_button && items.download_button) {
            $(".awoo-sep0").css("display", "inline");
        } else {
            $(".awoo-sep0").css("display", "none");
        }

    });
}

browser.runtime.onMessage.addListener(function(message, sender, reply) {
    if (message.name === "reload_settings") {
        reload_settings(message.settings);
    }
})

Awoobooru();