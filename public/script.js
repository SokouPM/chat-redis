const socket = io();
let user = "John Doe";

document.querySelector("select").addEventListener("change", (e) => {
	user = e.target.value;

	document.querySelectorAll("li").forEach((li) => {
		getMessages().then((response) => {
			const messagesUl = document.querySelector(".messages-list");
			messagesUl.innerHTML = "";

			response.map((data) => {
				messagesUl.innerHTML += `
					<li class="${data.user === user ? 'user-message ml-auto' : 'contact-message mr-auto'} w-7/12 p-2 my-4 overflow-hidden" >
						${data.message}
					</li>
				`;
			});
		});
	});
});

document.querySelector("form").addEventListener("submit", (e) => {
	e.preventDefault();
	sendMessage().then(() => {
		document.querySelector(".message").value = ""
	});
});

document.querySelector(".message").addEventListener("keyup", (e) => {
	const charLength = e.target.value.length;

	if (charLength <= 150) {
		document.querySelector(".char-count").innerHTML = charLength + "/150";
	}
});


socket.on("chat message", (message) => {
	receiveMessage(message);
});

window.onload = () => {
	getMessages().then((response) => {
		const messagesUl = document.querySelector(".messages-list");
		messagesUl.innerHTML = "";

		response.map((data) => {
			messagesUl.innerHTML += `
					<li class="${data.user === user ? 'user-message ml-auto' : 'contact-message mr-auto'} w-7/12 p-2 my-4 overflow-hidden" >
						${data.message}
					</li>
				`;
		});
	});
};
const sendMessage = async () => {
	const message = document.querySelector(".message").value;

	if (!message) return;

	try {
		socket.emit("chat message", {user, message});
		const response = await fetch("/api/messages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({user, message})
		});
	} catch (error) {
		console.error("Error while sending message:", error);
	}
};
const getMessages = async () => {
	try {
		const response = await fetch("/api/messages", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		});

		return response.json();
	} catch (error) {
		console.error("Error while fetching messages:", error);
	}
};

const receiveMessage = (messageObj) => {
	const messagesUl = document.querySelector(".messages-list");
	messagesUl.innerHTML += `
		<li class="${messageObj.user === user ? 'user-message ml-auto' : 'contact-message mr-auto'} w-7/12 p-2 my-4" >
			${messageObj.message}
		</li>
	`;
};