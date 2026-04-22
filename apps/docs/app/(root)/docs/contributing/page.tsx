import {
	ExternalLinkIcon,
	GithubIcon,
	GitPullRequestIcon,
	MessageSquareHeartIcon,
} from 'lucide-react';

export default function ContributingPage() {
	return (
		<div className="flex max-w-3xl flex-col gap-8">
			<header className="flex flex-col gap-3">
				<h1 className="text-balance font-bold text-4xl text-foreground tracking-tight">
					Contribuição
				</h1>
				<p className="text-lg text-muted-foreground leading-relaxed">
					O EspocaBot é um projeto open-source e nós adoraríamos receber sua
					ajuda para melhorar a API e adicionar novos endpoints!
				</p>
			</header>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
					<GithubIcon className="mb-2 size-8 text-primary" />
					<h3 className="mb-1 font-semibold text-lg">Repositório Oficial</h3>
					<p className="mb-4 text-muted-foreground text-sm">
						Todo o código da API e desta documentação está disponível
						publicamente no GitHub.
					</p>
					<a
						href="https://github.com/espocabot/api"
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 font-medium text-primary text-sm hover:underline"
					>
						Acessar repositório <ExternalLinkIcon className="size-3" />
					</a>
				</div>

				<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
					<GitPullRequestIcon className="mb-2 size-8 text-primary" />
					<h3 className="mb-1 font-semibold text-lg">Como ajudar?</h3>
					<p className="text-muted-foreground text-sm">
						Você pode ajudar abrindo Issues para relatar bugs, sugerir novos
						comandos ou enviando Pull Requests com código para melhorias.
					</p>
				</div>
			</div>

			<div className="mt-4 rounded-xl border bg-secondary/30 p-6 shadow-sm">
				<div className="mb-4 flex items-center gap-4">
					<div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
						<MessageSquareHeartIcon className="size-5 text-primary" />
					</div>
					<h3 className="font-semibold text-lg">Regras de Contribuição</h3>
				</div>
				<ul className="ml-2 list-inside list-disc space-y-2 text-muted-foreground leading-relaxed">
					<li>
						Verifique se já não existe uma Issue aberta sobre o mesmo tópico.
					</li>
					<li>
						Para novos endpoints, certifique-se de que a plataforma alvo possua
						uma API pública acessível.
					</li>
					<li>
						Mantenha o padrão de código existente (usamos Biome para
						lint/formatação).
					</li>
					<li>Teste suas alterações localmente antes de enviar um PR.</li>
				</ul>
			</div>
		</div>
	);
}
