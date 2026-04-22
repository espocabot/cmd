import { CommandIcon, SparklesIcon, TerminalIcon } from 'lucide-react';

export default function DocsPage() {
	return (
		<div className="flex max-w-3xl flex-col gap-8">
			<header className="flex flex-col gap-3">
				<h1 className="text-balance font-bold text-4xl text-foreground tracking-tight">
					Bem-vindo à Documentação
				</h1>
				<p className="text-lg text-muted-foreground leading-relaxed">
					O EspocaBot fornece uma série de APIs simples e diretas para você
					integrar com bots de chat (como Nightbot, StreamElements e Botrix) e
					melhorar a interação na sua live.
				</p>
			</header>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
					<TerminalIcon className="mb-2 size-8 text-primary" />
					<h3 className="mb-1 font-semibold text-lg">Comandos Prontos</h3>
					<p className="text-muted-foreground text-sm">
						Copie e cole comandos diretamente no chat da sua live. Nós geramos a
						sintaxe correta para o seu bot favorito.
					</p>
				</div>
				<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
					<SparklesIcon className="mb-2 size-8 text-primary" />
					<h3 className="mb-1 font-semibold text-lg">Personalizável</h3>
					<p className="text-muted-foreground text-sm">
						Ajuste textos, formatação e respostas de acordo com a vibe da sua
						stream usando nossa interface interativa.
					</p>
				</div>
			</div>

			<div className="mt-4 rounded-xl border bg-secondary/30 p-6 shadow-sm">
				<div className="mb-4 flex items-center gap-4">
					<div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
						<CommandIcon className="size-5 text-primary" />
					</div>
					<h3 className="font-semibold text-lg">Como começar?</h3>
				</div>
				<p className="text-muted-foreground leading-relaxed">
					Navegue pelo menu lateral para explorar todos os comandos disponíveis.
					Cada página de comando conta com um gerador interativo onde você pode
					testar parâmetros, ver o resultado em tempo real e copiar o código
					exato para adicionar ao seu bot.
				</p>
			</div>
		</div>
	);
}
