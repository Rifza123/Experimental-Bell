export const playwright = async (code) => {
	let res = await fetch("https://try.playwright.tech/service/control/run", {
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			code,
			"language": "javascript"
		}),
		method: "POST"
	}).then(a => a.json());
	return res;
};