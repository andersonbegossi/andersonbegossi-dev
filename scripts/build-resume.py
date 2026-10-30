# /// script
# requires-python = ">=3.11"
# dependencies = ["reportlab>=4"]
# ///
"""Build the resume PDFs the Home and About screens offer, one per locale.

    uv run scripts/build-resume.py

Writes public/Anderson-Begossi-Resume.pdf (en) and
public/Anderson-Begossi-Curriculo.pdf (pt); `siteConfig.resume` points each
locale at its file. The content mirrors Anderson's LinkedIn profile, as does the
About screen's `src/lib/data/background.ts`; change all three together. The
output is byte-for-byte reproducible, so a rebuild with no content change leaves
no diff.
"""

from pathlib import Path

from reportlab import rl_config
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

rl_config.invariant = 1

PUBLIC = Path(__file__).resolve().parent.parent / "public"

INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#4B5563")
ACCENT = colors.HexColor("#2563EB")

name = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=22, leading=26, alignment=TA_CENTER, textColor=INK)
headline = ParagraphStyle("headline", fontName="Helvetica-Bold", fontSize=11, leading=15, alignment=TA_CENTER, textColor=ACCENT)
contact = ParagraphStyle("contact", fontName="Helvetica", fontSize=8.5, leading=12, alignment=TA_CENTER, textColor=MUTED)
section = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK, spaceBefore=10)
body = ParagraphStyle("body", fontName="Helvetica", fontSize=9, leading=12.5, alignment=TA_JUSTIFY, textColor=INK)
label = ParagraphStyle("label", parent=body, fontName="Helvetica-Bold", alignment=0)
cell = ParagraphStyle("cell", parent=body, alignment=0)
role = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=INK, spaceBefore=6)
meta = ParagraphStyle("meta", fontName="Helvetica-Oblique", fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=2)
bullet = ParagraphStyle("bullet", parent=body, leftIndent=10, bulletIndent=0, spaceAfter=2.5)

SEP = " &nbsp;•&nbsp; "


def link(url: str, text: str) -> str:
    return f'<a href="{url}" color="#4B5563">{text}</a>'


LINKS = SEP.join(
    [
        link("https://www.linkedin.com/in/andersonbegossi", "linkedin.com/in/andersonbegossi"),
        link("https://github.com/andersonbegossi", "github.com/andersonbegossi"),
    ]
)
EMAIL = link("mailto:andersonbegossi@gmail.com", "andersonbegossi@gmail.com")

RESUMES = {
    "pt": {
        "file": "Anderson-Begossi-Curriculo.pdf",
        "title": "Anderson Begossi - Currículo",
        "headline": "Desenvolvedor Mobile Sênior | React Native · React · TypeScript · Expo",
        "contact": ["Nova Prata, RS, Brasil", "(54) 99636-4030", EMAIL],
        "sections": {
            "summary": "RESUMO PROFISSIONAL",
            "skills": "COMPETÊNCIAS TÉCNICAS",
            "experience": "EXPERIÊNCIA PROFISSIONAL",
            "education": "FORMAÇÃO ACADÊMICA",
            "certifications": "CERTIFICAÇÕES",
        },
        "summary": (
            "Desenvolvedor de Software com mais de 6 anos de experiência, especializado em desenvolvimento mobile "
            "e frontend com React Native, React, Expo e Node.js. Atualmente desenvolvo e mantenho aplicativos "
            "mobile para grandes marcas do setor de saúde (Dental Cremer, Dental Speed e Utilidades Clínicas — "
            "Henry Schein, NASDAQ:HSIC), utilizados por milhares de usuários e com avaliação média de 4,9/5 "
            "estrelas na App Store e no Google Play. Experiência em funcionalidades críticas de e-commerce "
            "(checkout, provador virtual, busca por voz, autenticação biométrica e 2FA), arquitetura de monorepos, "
            "criação de bibliotecas privadas no NPM e Design Systems, sempre com foco em performance, segurança, "
            "acessibilidade e boas práticas de engenharia de software."
        ),
        "skills": [
            ("Mobile:", "React Native, Expo, Android, iOS, autenticação biométrica, acessibilidade"),
            ("Frontend:", "React, Next.js, Redux, Styled Components, Material UI, Design Systems"),
            ("Backend:", "Node.js, AdonisJS, integração com APIs REST, Google Cloud (GCP), Speech-to-Text"),
            ("Arquitetura:", "Arquitetura de software, Domain-Driven Design (DDD), monorepos"),
            ("Linguagens:", "JavaScript, TypeScript, Python"),
            (
                "Ferramentas:",
                "Git, GitHub Actions, Turborepo, Firebase, Jest, NPM (bibliotecas privadas), Claude Code, "
                "Jupyter Notebook, Matplotlib",
            ),
            ("Metodologias:", "Scrum, metodologias ágeis"),
            ("Idiomas:", "Português (nativo), Inglês (básico a intermediário)"),
        ],
        "experience": [
            (
                "Desenvolvedor Mobile React Native — Bamse",
                "Março de 2022 – Atual · Blumenau, SC (remoto)",
                [
                    "Desenvolvi e mantive os aplicativos mobile da Dental Cremer, Dental Speed e Utilidades "
                    "Clínicas (Henry Schein — NASDAQ:HSIC) com React Native, utilizados por milhares de usuários e "
                    "com avaliação média de <b>4,9/5 estrelas</b> na App Store e no Google Play.",
                    "Desenvolvi funcionalidades estratégicas como tela de detalhes do produto, busca por voz, "
                    "autenticação biométrica, social e em dois fatores (2FA) e <b>provador virtual</b>, integrando "
                    "APIs internas e recursos nativos com foco em desempenho, segurança e manutenibilidade.",
                    "Implementei o fluxo de pagamento via <b>Pix no checkout</b>, integrando o app às APIs internas "
                    "com foco em segurança, confiabilidade e otimização do processo de compra.",
                    "Implementei o <b>Design System</b> compartilhado entre os três aplicativos com Styled "
                    "Components, promovendo reutilização de componentes, consistência visual e maior produtividade.",
                    "Aprimorei a <b>acessibilidade</b> dos aplicativos com suporte a leitores de tela e boas "
                    "práticas, tornando a navegação mais inclusiva.",
                    "Reduzi o tempo de desenvolvimento em <b>~30%</b> e aumentei a reutilização de código entre os "
                    "apps, criando bibliotecas privadas compartilhadas (componentes, temas e regras de negócio) "
                    "publicadas no NPM.",
                    "Contribuí para a migração da arquitetura multirrepositórios para <b>monorepo</b>, reduzindo "
                    "tempo de setup, desenvolvimento e manutenção, centralizando bibliotecas compartilhadas e "
                    "simplificando o gerenciamento de dependências.",
                ],
            ),
            (
                "Desenvolvedor Front-end React/React Native — Softaliza",
                "Setembro de 2020 – Fevereiro de 2022 (1 ano e 6 meses) · Santa Maria, RS (remoto)",
                [
                    "Desenvolvi funcionalidades estratégicas para a plataforma de eventos Ciente Studio: hotsites "
                    "de eventos, painel de configuração, fluxo de inscrição e módulo de transmissão, com foco em "
                    "escalabilidade e desempenho.",
                    "Implementei a <b>integração com o Zoom</b> via APIs, viabilizando transmissões ao vivo de "
                    "forma confiável e estável.",
                    "Modernizei e mantive o aplicativo Camobi Segura, atualizando dependências, implementando "
                    "correções e aumentando a estabilidade da aplicação.",
                ],
            ),
            (
                "Desenvolvedor Full-stack React/React Native/Node.js — Zion Tech",
                "Maio de 2020 – Agosto de 2021 (1 ano e 4 meses) · Caxias do Sul, RS (remoto, meio período)",
                [
                    "Desenvolvi o aplicativo mobile <b>Você + Saúde</b> em React Native, com funcionalidades de "
                    "acompanhamento de saúde focadas em desempenho e qualidade.",
                    "Criei um serviço backend com Node.js e AdonisJS, centralizando a comunicação com APIs e "
                    "implementando integrações seguras e escaláveis.",
                    "Desenvolvi uma landing page responsiva com Next.js, aplicando boas práticas de performance e "
                    "SEO para apoiar a aquisição de usuários.",
                    "Criei o aplicativo <b>Stewart Acid-Base</b>, ferramenta de apoio à decisão clínica para "
                    "profissionais de saúde, com cálculos confiáveis e interface intuitiva.",
                ],
            ),
            (
                "Pesquisador de Iniciação Científica — UCS (Universidade de Caxias do Sul)",
                "Julho de 2017 – Julho de 2019 (2 anos e 1 mês) · Caxias do Sul, RS",
                [
                    "Desenvolvi um sistema de medição de forças na ordem de nanonewtons com sensor piezoelétrico de "
                    "quartzo e scripts em Python, viabilizando medições de alta precisão.",
                    "Apresentei o projeto no XXVII Encontro de Jovens Pesquisadores da UCS.",
                ],
            ),
        ],
        "education": (
            "Bacharelado em Ciência da Computação — UCS (Universidade de Caxias do Sul)",
            "Janeiro de 2015 – Julho de 2021",
            "TCC: protótipo de aplicativo para o auxílio de crianças com dislexia, com React Native, Node.js, "
            "Domain-Driven Design e a API Speech-to-Text do Google.",
        ),
        "certifications": [
            "Bootcamp GoStack 10 — Rocketseat (junho de 2020)",
            "Web Design Completo — Origamid (dezembro de 2019)",
        ],
    },
    "en": {
        "file": "Anderson-Begossi-Resume.pdf",
        "title": "Anderson Begossi - Resume",
        "headline": "Senior Mobile Developer | React Native · React · TypeScript · Expo",
        "contact": ["Nova Prata, RS, Brazil", "+55 (54) 99636-4030", EMAIL],
        "sections": {
            "summary": "PROFESSIONAL SUMMARY",
            "skills": "TECHNICAL SKILLS",
            "experience": "PROFESSIONAL EXPERIENCE",
            "education": "EDUCATION",
            "certifications": "CERTIFICATIONS",
        },
        "summary": (
            "Software Developer with 6+ years of experience, specialized in mobile and frontend development with "
            "React Native, React, Expo and Node.js. I currently build and maintain mobile apps for major healthcare "
            "brands (Dental Cremer, Dental Speed and Utilidades Clínicas — Henry Schein, NASDAQ:HSIC), used by "
            "thousands of users and rated 4.9/5 stars on the App Store and Google Play. Experienced in critical "
            "e-commerce features (checkout, virtual try-on, voice search, biometric authentication and 2FA), "
            "monorepo architecture, private NPM libraries and Design Systems, always focused on performance, "
            "security, accessibility and software engineering best practices."
        ),
        "skills": [
            ("Mobile:", "React Native, Expo, Android, iOS, biometric authentication, accessibility"),
            ("Frontend:", "React, Next.js, Redux, Styled Components, Material UI, Design Systems"),
            ("Backend:", "Node.js, AdonisJS, REST API integration, Google Cloud (GCP), Speech-to-Text"),
            ("Architecture:", "Software architecture, Domain-Driven Design (DDD), monorepos"),
            ("Languages:", "JavaScript, TypeScript, Python"),
            (
                "Tooling:",
                "Git, GitHub Actions, Turborepo, Firebase, Jest, NPM (private libraries), Claude Code, "
                "Jupyter Notebook, Matplotlib",
            ),
            ("Methodologies:", "Scrum, agile methodologies"),
            ("Spoken languages:", "Portuguese (native), English (basic to intermediate)"),
        ],
        "experience": [
            (
                "React Native Mobile Developer — Bamse",
                "March 2022 – Present · Blumenau, SC, Brazil (remote)",
                [
                    "Developed and maintained the mobile applications for Dental Cremer, Dental Speed, and "
                    "Utilidades Clínicas (Henry Schein – NASDAQ: HSIC), serving thousands of users and maintaining "
                    "a 4.9★ average app store rating by delivering new features, bug fixes, and continuous "
                    "improvements using React Native.",
                    "Developed key application features, including the product details page, voice search, biometric "
                    "authentication, social authentication, two-factor authentication (2FA), and virtual try-on, "
                    "following software engineering best practices and integrating with internal APIs and native "
                    "platform capabilities while focusing on performance, security, and maintainability.",
                    "Implemented the Pix payment flow in the checkout process, integrating the mobile application "
                    "with internal APIs to deliver a secure, reliable, and optimized purchasing experience.",
                    "Implemented the shared Design System across all three applications using Styled Components, "
                    "increasing component reusability, ensuring UI consistency, and improving development "
                    "productivity.",
                    "Improved the accessibility of the mobile applications by implementing screen reader support and "
                    "accessibility best practices to provide a more inclusive user experience.",
                    "Reduced development time by approximately 30% and increased code reuse across applications by "
                    "creating shared private libraries for components, themes, and business logic.",
                    "Contributed to the migration of the applications' architecture to a monorepo, significantly "
                    "reducing setup, development, and maintenance time by centralizing shared libraries, "
                    "standardizing the project structure, and simplifying dependency management.",
                ],
            ),
            (
                "Front-end Developer React/React Native — Softaliza",
                "September 2020 – February 2022 (1 yr 6 mos) · Santa Maria, RS, Brazil (remote)",
                [
                    "Developed key features for the Ciente Studio event platform, including event microsites, "
                    "microsite management dashboard, registration flow, and live streaming module, following "
                    "software engineering best practices with a focus on scalability, performance, and "
                    "maintainability.",
                    "Implemented Zoom integration for the Ciente Studio platform, enabling live event streaming "
                    "through APIs while ensuring a reliable and stable integration.",
                    "Performed technology upgrades and maintenance for the Camobi Segura mobile application, "
                    "modernizing dependencies, implementing bug fixes, and improving application stability and "
                    "reliability.",
                ],
            ),
            (
                "Full-stack Developer React/React Native/Node.js — Zion Tech",
                "May 2020 – August 2021 (1 yr 4 mos) · Caxias do Sul, RS, Brazil (remote, part-time)",
                [
                    "Developed the Você + Saúde mobile application using React Native, implementing health "
                    "monitoring features with a focus on performance, quality, and maintainability.",
                    "Developed a backend service using Node.js and AdonisJS, centralizing communication with APIs "
                    "and implementing secure and scalable integrations.",
                    "Developed a responsive landing page using Next.js, applying best practices for performance, "
                    "SEO, and responsiveness to support user acquisition.",
                    "Developed the Stewart Acid-Base mobile application, creating a clinical decision support tool "
                    "for healthcare professionals by implementing reliable clinical calculations and an intuitive "
                    "user interface.",
                ],
            ),
            (
                "Undergraduate Researcher — UCS (Universidade de Caxias do Sul)",
                "July 2017 – July 2019 (2 yrs 1 mo) · Caxias do Sul, RS, Brazil",
                [
                    "Developed a force measurement system capable of detecting nanonewton-level forces using a "
                    "quartz piezoelectric sensor and Python scripts, enabling high-precision measurements for "
                    "experimental applications.",
                    "Presented the piezoelectric sensor project at the 27th Young Researchers Conference at the "
                    "University of Caxias do Sul (UCS), sharing the academic results and their scientific "
                    "applications.",
                ],
            ),
        ],
        "education": (
            "BSc in Computer Science — UCS (Universidade de Caxias do Sul)",
            "January 2015 – July 2021",
            "Thesis: mobile app prototype to support children with dyslexia, built with React Native, Node.js, "
            "Domain-Driven Design and Google's Speech-to-Text API.",
        ),
        "certifications": [
            "GoStack 10 Bootcamp — Rocketseat (June 2020)",
            "Complete Web Design — Origamid (December 2019)",
        ],
    },
}


def heading(text: str) -> list:
    return [
        Paragraph(text, section),
        HRFlowable(width="100%", thickness=0.8, color=ACCENT, spaceBefore=1, spaceAfter=6),
    ]


_STAR_FONT_READY = False


def _ensure_star_font() -> None:
    """Helvetica has no ★. Register a face that does, the first time a bullet needs one."""
    global _STAR_FONT_READY
    if _STAR_FONT_READY:
        return
    candidates = [
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/dejavu-sans-fonts/DejaVuSans.ttf"),
        Path("/Library/Fonts/DejaVuSans.ttf"),
        Path.home() / "Library/Fonts/DejaVuSans.ttf",
    ]
    for path in candidates:
        if path.is_file():
            pdfmetrics.registerFont(TTFont("DejaVuSans", str(path)))
            _STAR_FONT_READY = True
            return
    raise SystemExit("DejaVu Sans is required to draw ★ in the resume PDF")


def bullets(items: list[str]) -> list:
    rendered = []
    for item in items:
        if "★" in item:
            _ensure_star_font()
            item = item.replace("★", f'<font name="DejaVuSans" size="{bullet.fontSize:g}">★</font>')
        rendered.append(Paragraph(item, bullet, bulletText="•"))
    return rendered


def build(resume: dict) -> Path:
    out = PUBLIC / resume["file"]
    sections = resume["sections"]
    doc = SimpleDocTemplate(
        str(out),
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=40,
        bottomMargin=40,
        title=resume["title"],
        author="Anderson Begossi",
    )

    story: list = [
        Paragraph("Anderson Begossi", name),
        Spacer(0, 2),
        Paragraph(resume["headline"], headline),
        Spacer(0, 3),
        Paragraph(SEP.join(resume["contact"]), contact),
        Paragraph(LINKS, contact),
        *heading(sections["summary"]),
        Paragraph(resume["summary"], body),
        *heading(sections["skills"]),
    ]

    skills = Table(
        [[Paragraph(k, label), Paragraph(v, cell)] for k, v in resume["skills"]],
        colWidths=[118, None],
    )
    skills.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 1.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ]
        )
    )
    story.append(skills)

    story += heading(sections["experience"])
    for title, when, items in resume["experience"]:
        head = [Paragraph(title, role), Paragraph(when, meta)]
        story.append(KeepTogether(head + bullets(items[:1])))
        story += bullets(items[1:])

    degree, years, thesis = resume["education"]
    story += heading(sections["education"])
    story += [Paragraph(degree, role), Paragraph(years, meta), Paragraph(thesis, body)]

    story += heading(sections["certifications"])
    story += bullets(resume["certifications"])

    doc.build(story)
    return out


if __name__ == "__main__":
    for resume in RESUMES.values():
        print(f"wrote {build(resume)}")
