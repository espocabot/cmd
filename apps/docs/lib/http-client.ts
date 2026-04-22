export async function httpClient(input: RequestInfo, init?: RequestInit) {
	const res = await fetch(input, {
		// credentials: "include",
		...init,
	});

	if (res.status === 401) {
		throw res;
	}

	return res;
}
