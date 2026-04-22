type Logo = { light: string } & (
	| {
			hasDark?: false;
			dark?: never;
	  }
	| {
			hasDark: true;
			dark: string;
	  }
);

type Logos = {
	[name: string]: Logo;
};

export const logos: Logos = {
	kick: {
		light: '/logos/social/kick.svg',
	},
	spotify: {
		light: '/logos/social/spotify.svg',
	},
	steam: {
		light: '/logos/social/steam.svg',
	},
	tiktok: {
		hasDark: true,
		light: '/logos/social/tiktok-light.svg',
		dark: '/logos/social/tiktok-dark.svg',
	},
	twitch: {
		light: '/logos/social/twitch.svg',
	},
	youtube: {
		light: '/logos/social/youtube.svg',
	},
	'dead-by-daylight': {
		light: '/logos/games/dead-by-daylight.svg',
	},
};
