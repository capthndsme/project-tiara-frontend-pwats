export function CheckDefaultPFP(val: string | undefined, username: string) {
	if (val && val === "DEFAULT_IMG") {
		username = username.toLowerCase();
		// Initialize a variable to store the sum of ASCII codes
		let total = 0;
		// Loop through each character in the username
		for (let char of username) {
			// Add the ASCII code of the character to the total
			total += char.codePointAt(0) || char.charCodeAt(0);
		}
		total = total;
		// Return the remainder of dividing the total by 5
	 
		const pfpSelector = total % 5;
		const defaultPfps = ["/default_pfp/1.jpg", "/default_pfp/2.jpg", "/default_pfp/3.jpg", "/default_pfp/4.jpg"];
		// Yes, this is client-sided.
		// Who wants to "hack" a profile picture anyways.
		const defaultPfp = defaultPfps[pfpSelector];

		return defaultPfp;
	} else {
		return val;
	}
}
