import { SoniaCharacter } from "./BrandMedia";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, MessageSquare, X } from "lucide-react";
import { Link } from "wouter";
import { WHATSAPP } from "@/data/site";
const suggestions = [
  {
    label: "Por onde minha empresa começa?",
    text: "Você pode começar pela capacitação ou pelo mapeamento de um processo prioritário. Educação, consultoria e desenvolvimento são caminhos disponíveis no portfólio.",
    href: "/servicos",
    cta: "Explorar as soluções",
  },
  {
    label: "O que é a SON.IA?",
    text: "A SON.IA é a plataforma de IA operacional que conecta conversas, agentes, sistemas e processos, com regras, permissões e supervisão humana.",
    href: "/servicos/sonia",
    cta: "Conhecer a plataforma",
  },
  {
    label: "Quero falar com um especialista",
    text: "O atendimento comercial está disponível pelo WhatsApp oficial da Onsmart.AI. A conversa será iniciada somente quando você escolher abrir o canal.",
    href: WHATSAPP,
    cta: "Abrir WhatsApp comercial",
  },
];
export default function SoniaDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="sonia-floating"
        aria-label="Abrir demonstração visual SON.IA"
      >
        <SoniaCharacter decorative className="floating-sonia-character" />
        <span>SON.IA</span>
        <span className="floating-dot" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay sonia-overlay" />
        <Dialog.Content className="sonia-dialog">
          <div className="sonia-dialog-head">
            <span className="sonia-avatar">
              <SoniaCharacter decorative />
            </span>
            <div>
              <Dialog.Title>Conheça a SON.IA</Dialog.Title>
              <span>Demonstração visual · não integrada</span>
            </div>
            <Dialog.Close
              aria-label="Fechar demonstração"
              className="dialog-close"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="sonia-chat-body">
            <Dialog.Description className="sonia-welcome">
              Olá! Conheça os caminhos para adotar IA na sua empresa. Selecione
              um tema para explorar o conteúdo institucional.
            </Dialog.Description>
            <div className="sonia-suggestions">
              {suggestions.map((s, i) => (
                <button
                  aria-pressed={selected === i}
                  key={s.label}
                  onClick={() => setSelected(i)}
                >
                  {s.label}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
            {selected !== null && (
              <div className="sonia-response" aria-live="polite">
                <p>{suggestions[selected].text}</p>
                {suggestions[selected].href.startsWith("/") ? (
                  <a
                    href={suggestions[selected].href}
                    onClick={() => setOpen(false)}
                  >
                    {suggestions[selected].cta}
                    <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <a
                    href={suggestions[selected].href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {suggestions[selected].cta}
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            )}
            <p className="sonia-disclaimer">
              Prévia de interface. Não é atendimento por IA, não recebe
              mensagens e não envia dados ao CRM. A integração real pertence à
              Fase 4.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
