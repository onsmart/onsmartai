import SitePhotography from "@/components/site/SitePhotography";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import "./inner.css";
import { useSearch } from "wouter";
import {
  ArrowUpRight,
  CalendarClock,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { ContactForm } from "@/components/site/Forms";
import { ButtonLink, Notice, PageHero } from "@/components/site/Common";
import CalendlyInline from "@/components/site/CalendlyInline";
import { useWhatsappLink } from "@/i18n/site";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { MARKETING_EMAIL } from "@shared/contact";

export default function Contact() {
  const { t } = useSiteCopy();
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();
  const whatsapp = useWhatsappLink();
  const search = useSearch();
  const interest = new URLSearchParams(search).get("interesse") || "";
  return (
    <div className="inner-page contact-page">
      <PageHero
        eyebrow={cmsText("Contato")}
        visual={<SitePhotography photoKey="strategy" eager />}
        title={cmsText(
          "Vamos conversar sobre o próximo passo da IA na sua empresa?"
        )}
        text={cmsText(
          "Nossa equipe está preparada para entender seus desafios e ajudar a identificar soluções adequadas à sua operação."
        )}
      >
        <div className="contact-hero-actions">
          <ButtonLink href={whatsapp} variant="primary">
            {cmsText("Falar pelo WhatsApp")}
          </ButtonLink>
          <a
            className="contact-hero-email"
            href={cmsHref(`mailto:${MARKETING_EMAIL}`)}
          >
            {MARKETING_EMAIL}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      <div className="inner-body">
        <section className="section contact-form-section">
          <div className="container contact-form-layout">
            <div className="contact-form-intro">
              <p className="eyebrow">
                <span />
                {cmsText("Conte o contexto")}
              </p>
              <h2>
                {cmsText("Uma boa conversa começa com a pergunta certa.")}
              </h2>
              <p>
                {cmsText(
                  "Selecione o assunto que mais se aproxima do seu momento. O campo complementar ajuda a direcionar sua mensagem à equipe certa."
                )}
              </p>
              <div
                className="contact-form-sequence"
                aria-label={t("contact.flowAria")}
              >
                <div>
                  <span>01</span>
                  <strong>{cmsText("Você compartilha")}</strong>
                  <small>{cmsText("o desafio da operação")}</small>
                </div>
                <div>
                  <span>02</span>
                  <strong>{cmsText("A equipe entende")}</strong>
                  <small>{cmsText("o próximo contexto")}</small>
                </div>
                <div>
                  <span>03</span>
                  <strong>{cmsText("A conversa avança")}</strong>
                  <small>{cmsText("com clareza e governança")}</small>
                </div>
              </div>
            </div>
            <ContactForm key={interest} initialInterest={interest} />
          </div>
        </section>

        <section className="section contact-channels-section">
          <div className="container">
            <div className="contact-section-heading">
              <div>
                <p className="eyebrow">
                  <span />
                  {cmsText("Canais comerciais")}
                </p>
                <h2>{cmsText("Escolha o caminho mais direto.")}</h2>
              </div>
              <span className="contact-heading-mark" aria-hidden="true">
                02<span>{cmsText("/03")}</span>
              </span>
            </div>
            <div className="contact-channels-grid">
              <a
                className="contact-channel contact-channel-whatsapp"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-channel-icon">
                  <MessageCircle
                    size={22}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="contact-channel-type">
                  {cmsText("WhatsApp comercial")}
                </span>
                <strong>{cmsText("+55 (11) 93068-3562")}</strong>
                <span className="contact-channel-action">
                  {cmsText("Abrir conversa ")}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </a>
              <a
                className="contact-channel contact-channel-email"
                href={cmsHref(`mailto:${MARKETING_EMAIL}`)}
              >
                <span className="contact-channel-icon">
                  <Mail size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="contact-channel-type">
                  {cmsText("E-mail comercial")}
                </span>
                <strong>{MARKETING_EMAIL}</strong>
                <span className="contact-channel-action">
                  {cmsText("Enviar e-mail ")}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="section contact-address-section">
          <div className="container contact-address-layout">
            <div className="contact-address-intro">
              <p className="eyebrow">
                <span />
                {cmsText("Unidades")}
              </p>
              <h2>{cmsText("Presença para conversar de perto.")}</h2>
              <p>
                {cmsText(
                  "Estamos em São Paulo e Curitiba. Agende uma visita ou fale conosco pelos canais comerciais."
                )}
              </p>
            </div>
            <div className="contact-address-list">
              <article className="contact-address-card">
                <span className="contact-address-number">01</span>
                <MapPin size={21} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <span>{t("contact.matrixLabel")}</span>
                  <address>
                    {cmsText("Rua Arizona, 1349, Conj. 1B,")}
                    <br />
                    {cmsText("Cidade Monções, São Paulo/SP")}
                  </address>
                </div>
              </article>
              <article className="contact-address-card">
                <span className="contact-address-number">02</span>
                <MapPin size={21} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <span>{t("contact.branchLabel")}</span>
                  <address>
                    {cmsText("Rua Comendador Araújo, 499, Cj. 1003,")}
                    <br />
                    {cmsText("Centro, Curitiba/PR")}
                  </address>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section contact-booking-section">
          <div className="container contact-booking-panel">
            <div className="contact-booking-header">
              <div className="contact-booking-header-main">
                <div className="contact-booking-icon">
                  <CalendarClock
                    size={26}
                    strokeWidth={1.35}
                    aria-hidden="true"
                  />
                </div>
                <div className="contact-booking-copy">
                  <p className="eyebrow">
                    <span />
                    {cmsText("Agendamento")}
                  </p>
                  <h2>
                    {cmsText("Reserve um espaço para o próximo capítulo.")}
                  </h2>
                  <p className="contact-booking-lead">{t("contact.bookingLead")}</p>
                </div>
              </div>
              <span className="contact-heading-mark" aria-hidden="true">
                03<span>{cmsText("/03")}</span>
              </span>
            </div>
            <CalendlyInline className="contact-calendly-inline" minHeight={720} />
          </div>
          <div className="container contact-notice-wrap">
            <Notice>{t("contact.bookingNotice")}</Notice>
          </div>
        </section>
      </div>
    </div>
  );
}
