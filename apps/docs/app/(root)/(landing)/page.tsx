import { EndpointsSection } from './_components/endpoints-section';
import { FooterSection } from './_components/footer-section';
import { HeaderSection } from './_components/header-section';
import { HeroSection } from './_components/hero-section';
import { HowItWorksSection } from './_components/how-it-works-section';

export default function Page() {
	return (
		<div className="min-h-screen">
			<HeaderSection />
			<HeroSection />
			<HowItWorksSection />
			<EndpointsSection />
			<FooterSection />
		</div>
	);
}
