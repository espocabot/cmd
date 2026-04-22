import { BookOpenIcon, CopyIcon, ZapIcon } from 'lucide-react';

export function HowItWorksSection() {
	return (
		<section className="mx-auto max-w-5xl px-4 py-16">
			<h2 className="mb-8 text-center font-bold text-2xl text-foreground">
				Como funciona
			</h2>
			<div className="grid gap-6 sm:grid-cols-3">
				{[
					{
						icon: <ZapIcon className="size-6" />,
						title: 'Escolha o endpoint',
						desc: 'Navegue pela documentação e encontre o comando que precisa para sua live.',
					},
					{
						icon: <BookOpenIcon className="size-6" />,
						title: 'Preencha os campos',
						desc: 'Configure os parâmetros de forma visual, sem precisar editar URLs.',
					},
					{
						icon: <CopyIcon className="size-6" />,
						title: 'Copie e use',
						desc: 'Copie o comando gerado e cole direto no chat da sua stream.',
					},
				].map((step) => (
					<div
						key={step.title}
						className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-6 text-center"
					>
						<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
							{step.icon}
						</span>
						<h3 className="font-semibold text-base text-foreground">
							{step.title}
						</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{step.desc}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
