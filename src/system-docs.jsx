import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Search,
  Menu,
  X,
  Check,
} from "lucide-react";
import {
  SYSTEM_DOCS,
  DOC_TOPICS,
  docsPath,
  docsTopics,
} from "./system-docs-data.js";
import { ThemeSwitch } from "./portfolio-shell.jsx";
import "./system-docs.css";

export function SystemDocumentation({ interactive = true }) {
  const { system, "*": rest } = useParams(),
    location = useLocation(),
    navigate = useNavigate();
  const data = SYSTEM_DOCS[system];
  const [menuOpen, setMenuOpen] = useState(false),
    [query, setQuery] = useState("");
  const heading = useRef(null),
    menuButton = useRef(null);
  const topic = rest || "foundations",
    component = data?.components.find((c) => topic === `components/${c.id}`),
    title = component?.title || DOC_TOPICS.find((t) => t.id === topic)?.title;
  useEffect(() => {
    setMenuOpen(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "instant" });
    const old = document.title;
    document.title = `${title || "Documentation"} | ${data?.name || "Design systems"} | Insan Nurjaman`;
    return () => {
      document.title = old;
    };
  }, [location.pathname, title, data?.name]);
  useEffect(() => {
    function escape(e) {
      if (e.key === "Escape") {
        setQuery("");
        if (menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menuOpen]);
  if (!data)
    return (
      <div className="system-docs">
        <main className="docs-not-found">
          <h1>System not found</h1>
          <p>Choose one of the documented systems from the portfolio.</p>
          <Link to="/design-systems">
            All design systems <ArrowRight size={18} />
          </Link>
        </main>
      </div>
    );
  if (!rest) return <Navigate to={docsPath(system)} replace />;
  const topics = docsTopics(system),
    results = query.trim()
      ? topics.filter((t) =>
          `${t.title} ${t.group}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
        )
      : [];
  function navigateTopic() {
    setMenuOpen(false);
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  return (
    <div
      className={`system-docs ${menuOpen ? "docs-menu-open" : ""}`}
    >
      <a className="docs-skip" href="#docs-content">
        Skip to documentation
      </a>
      <header className="docs-top">
        <div className="docs-identity">
          <Link to="/" aria-label="Insan portfolio home">
            <img
              src="/brand/insan-editorial.svg"
              width="32"
              height="32"
              alt="Insan ASCII portrait"
            />
          </Link>
          <span className="docs-identity-label">Design systems</span>
          <label className="docs-sr" htmlFor="docs-system">
            Select design system
          </label>
          <select
            id="docs-system"
            value={system}
            onChange={(e) => {
              const key = e.target.value;
              const valid = docsTopics(key).some((t) => t.id === topic);
              navigate(docsPath(key, valid ? topic : "foundations"));
            }}
          >
            {Object.entries(SYSTEM_DOCS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <nav className="docs-tabs" aria-label="Documentation sections">
          <Link
            className={!component && topic !== "guidelines" ? "active" : ""}
            to={docsPath(system)}
          >
            Foundations
          </Link>
          <Link
            className={component ? "active" : ""}
            to={docsPath(system, "components/button")}
          >
            Components
          </Link>
          <Link
            className={topic === "guidelines" ? "active" : ""}
            to={docsPath(system, "guidelines")}
          >
            Guidelines
          </Link>
        </nav>
        <div className="docs-top-actions">
          <div className="docs-search">
            <Search size={16} aria-hidden="true" />
            <label className="docs-sr" htmlFor="docs-search">
              Search this documentation
            </label>
            <input
              id="docs-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs…"
              autoComplete="off"
            />
            {query.trim() && (
              <div
                className="docs-search-results"
                role="region"
                aria-label="Documentation search results"
              >
                {results.length ? (
                  results.map((t) => (
                    <Link
                      key={t.id}
                      to={docsPath(system, t.id)}
                      onClick={() => setQuery("")}
                    >
                      <span>{t.title}</span>
                      <small>{t.group}</small>
                    </Link>
                  ))
                ) : (
                  <p>No topics found. Try “color” or “button”.</p>
                )}
              </div>
            )}
          </div>
          {interactive && <ThemeSwitch/>}
          <Link className="docs-back" to="/design-systems">
            Back to portfolio <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      <div className="docs-mobile-nav">
        <button
          ref={menuButton}
          aria-expanded={menuOpen}
          aria-controls="docs-sidebar"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={17} /> : <Menu size={17} />} Browse documentation
        </button>
        <span>{title || "Not found"}</span>
      </div>
      <aside
        id="docs-sidebar"
        className="docs-sidebar"
        aria-label="Documentation categories"
      >
        {["Foundations", "Components", "Guidelines"].map((group) => (
          <div className="docs-nav-group" key={group}>
            <p>{group}</p>
            <nav aria-label={group}>
              {topics
                .filter((t) => t.group === group)
                .map((t) => (
                  <NavLink
                    end
                    to={docsPath(system, t.id)}
                    key={t.id}
                    onClick={navigateTopic}
                  >
                    {t.id === "foundations" ? "Overview" : t.title}
                    {t.group === "Components" && (
                      <ArrowUpRight size={12} aria-hidden="true" />
                    )}
                  </NavLink>
                ))}
            </nav>
          </div>
        ))}
        <div className="docs-story-link">
          <p>Behind the system</p>
          <Link to={data.story}>
            Read the case study <ArrowUpRight size={15} />
          </Link>
          <Link to="/design-systems">
            All design systems <ArrowRight size={15} />
          </Link>
          <small>
            Curated public preview.
            <br />
            Private libraries stay private.
          </small>
        </div>
      </aside>
      <main id="docs-content" className="docs-main">
        <nav className="docs-breadcrumb" aria-label="Breadcrumb">
          <Link to={docsPath(system)}>{data.name}</Link>
          <span aria-hidden="true">/</span>
          {component && (
            <>
              <Link to={docsPath(system, "components/button")}>Components</Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span>{title || "Not found"}</span>
        </nav>
        <h1 ref={heading} tabIndex={-1}>
          {title || "Topic not found"}
        </h1>
        <p className="docs-deck">
          {component ? (
            component.purpose
          ) : topic === "foundations" ? (
            <>
              {data.intro}
              <br />
              {data.description}
            </>
          ) : topic === "color" ? (
            data.colorCopy
          ) : topic === "typography" ? (
            data.typeCopy
          ) : topic === "layout" ? (
            "Rhythm, alignment, and density give complex product tasks a readable structure."
          ) : topic === "guidelines" ? (
            "Guidance explains how to choose a pattern and what still needs validation."
          ) : (
            "This topic is not part of the curated documentation. Choose a category from the navigation."
          )}
        </p>
        <div className="docs-meta">
          <span>Created & adapted by Insan Nurjaman</span>
          <span>{data.foundation} foundation</span>
          <span>
            <i aria-hidden="true" />
            Curated public preview
          </span>
        </div>
        {topic === "foundations" ? (
          <FoundationOverview system={system} data={data} />
        ) : topic === "color" ? (
          <ColorDocumentation data={data} />
        ) : topic === "typography" ? (
          <TypeDocumentation data={data} />
        ) : topic === "layout" ? (
          <LayoutDocumentation data={data} />
        ) : topic === "guidelines" ? (
          <Guidelines data={data} />
        ) : component ? (
          <ComponentDocumentation
            key={`${system}-${component.id}`}
            system={system}
            component={component}
            theme="light"
          />
        ) : (
          <Link to={docsPath(system)}>
            Return to Foundations <ArrowRight size={17} />
          </Link>
        )}
        <div className="docs-bottom">
          <p>
            Curated design documentation by Insan Nurjaman. Native examples are
            illustrative, not a production package or a standards certification.
          </p>
          <Link to={data.story}>
            Explore the story <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
function FoundationOverview({ system, data }) {
  return (
    <>
      <div className="docs-catalog">
        {[
          {
            id: "color",
            title: "Color",
            copy: "Brand values meet semantic roles, from surface to action.",
            art: <ColorArt data={data} />,
          },
          {
            id: "typography",
            title: "Typography",
            copy: "A consistent hierarchy with room for product identity.",
            art: (
              <div className="docs-type-art">
                <b>Aa</b>
                <div>
                  <span>Readable by role.</span>
                  <small>Heading / Body / Label</small>
                </div>
              </div>
            ),
          },
          {
            id: "layout",
            title: "Layout",
            copy: "Rhythm and density make complex pages easier to scan.",
            art: (
              <div className="docs-space-art">
                <i />
                <i />
                <i />
                <i />
                <code>
                  space
                  <br />
                  with
                  <br />
                  intent
                </code>
              </div>
            ),
          },
          {
            id: "components/button",
            title: "Into components",
            copy: "See how a Button carries shared decisions into an action.",
            art: (
              <div className="docs-button-art">
                <span>Save changes</span>
                <small>Foundation → reusable decision</small>
              </div>
            ),
          },
        ].map((item) => (
          <Link
            className="docs-catalog-item"
            to={docsPath(system, item.id)}
            key={item.id}
          >
            <div className="docs-specimen">{item.art}</div>
            <div>
              <h2>{item.title}</h2>
              <ArrowUpRight size={18} />
            </div>
            <p>{item.copy}</p>
          </Link>
        ))}
      </div>
      <section className="docs-section">
        <h2>Color with a job to do.</h2>
        <p>{data.colorCopy}</p>
        <TokenTable data={data} />
      </section>
      <section className="docs-section">
        <h2>Hierarchy before decoration.</h2>
        <TypeTable data={data} />
        <p className="docs-note">
          Native documentation uses the portfolio’s Manrope. Source
          exports keep their own typography.
        </p>
      </section>
      <section className="docs-section">
        <h2>Make the rhythm visible.</h2>
        <LayoutRows data={data} />
        <p className="docs-note">
          The catalog spacing bars are conceptual, not a verified numeric token
          scale.
        </p>
      </section>
    </>
  );
}
function ColorArt({ data }) {
  return data.colors.length ? (
    <div className="docs-color-art">
      {data.colors.map((c) => (
        <div
          key={c.name}
          style={{ background: c.value }}
          aria-label={`${c.name} ${c.value}`}
        />
      ))}
    </div>
  ) : (
    <div className="docs-alias-art">
      <code>primitive</code>
      <ArrowRight size={20} />
      <code>semantic</code>
      <ArrowRight size={20} />
      <code>component</code>
    </div>
  );
}
function TokenTable({ data }) {
  return (
    <div className="docs-table-wrap">
      <table>
        <caption>Selected source relationships</caption>
        <thead>
          <tr>
            {(data.name === "AccelByte"
              ? ["Base value", "Brand role", "Component role"]
              : ["Context", "Semantic role", "Primitive reference"]
            ).map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.tokens.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    <code>{v}</code>
                  </th>
                ) : (
                  <td key={j}>
                    <code>{v}</code>
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function ColorDocumentation({ data }) {
  return (
    <>
      <section className="docs-section docs-first-section">
        <h2>Values and roles</h2>
        {data.colors.length > 0 && (
          <div className="docs-swatch-list">
            {data.colors.map((c) => (
              <div key={c.name}>
                <i style={{ background: c.value }} />
                <span>
                  {c.name}
                  <code>{c.value}</code>
                </span>
              </div>
            ))}
          </div>
        )}
        <TokenTable data={data} />
        <p className="docs-note">
          Selected source examples, not a complete token catalog. Changing this
          documentation’s theme does not rewrite the source library.
        </p>
      </section>
      {data.colorImages && (
        <section className="docs-section">
          <h2>Original brand-theme examples</h2>
          <SourcePreview
            images={data.colorImages}
            labels={[
              "InstantFunding dark",
              "InstantFunding light",
              "VoltFunded dark",
              "VoltFunded light",
            ]}
          />
        </section>
      )}
      <section className="docs-section">
        <h2>From roles to decisions</h2>
        <p>
          Use a semantic name to explain purpose. A palette reference supplies
          the value; a component uses that role for a specific region or state.
          Review contrast and valid combinations in the implementation rather
          than assuming that a token name guarantees them.
        </p>
      </section>
    </>
  );
}
function TypeTable({ data }) {
  return (
    <div className="docs-table-wrap">
      <table>
        <caption>Source typography choices</caption>
        <thead>
          <tr>
            <th scope="col">Mode / role</th>
            <th scope="col">Family</th>
            <th scope="col">Body / size</th>
          </tr>
        </thead>
        <tbody>
          {data.typography.map((r) => (
            <tr key={r[0]}>
              <th scope="row">{r[0]}</th>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function TypeDocumentation({ data }) {
  return (
    <>
      <section className="docs-section docs-first-section">
        <h2>Type by role</h2>
        <TypeTable data={data} />
        <div className="docs-type-sample">
          <span>Design the hierarchy.</span>
          <p>
            Keep labels, supporting text, and longer explanations distinct
            without losing their relationship.
          </p>
          <small>Native documentation specimen · Manrope</small>
        </div>
      </section>
      <section className="docs-section">
        <h2>Keep the source distinction clear</h2>
        <p>{data.typeCopy}</p>
        <p>
          Source family names are documented choices. This native specimen is
          not a font-parity reproduction of the product UI.
        </p>
      </section>
    </>
  );
}
function LayoutRows({ data }) {
  return (
    <div className="docs-layout-rows">
      {data.layoutRows.map(([title, copy]) => (
        <div key={title}>
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
      ))}
    </div>
  );
}
function LayoutDocumentation({ data }) {
  return (
    <>
      <section className="docs-section docs-first-section">
        <h2>Structure before density</h2>
        <LayoutRows data={data} />
      </section>
      <section className="docs-section">
        <h2>Group by task</h2>
        <p>
          Keep related controls together. Separate different decisions through
          spacing and headings. On narrow screens, preserve context through
          reflow rather than reducing every value proportionally.
        </p>
        <div className="docs-space-art docs-large-space-art">
          <i />
          <i />
          <i />
          <i />
          <code>Control → Group → Section</code>
        </div>
        <p className="docs-note">
          Conceptual rhythm illustration. Only explicitly listed source values
          above are numeric specifications.
        </p>
      </section>
    </>
  );
}
function Guidelines({ data }) {
  return (
    <>
      <section className="docs-section docs-first-section">
        <h2>Make the choice explainable</h2>
        <p>{data.guidance}</p>
        <ul>
          <li>Define the task and the context before choosing a component.</li>
          <li>
            Review default, active, disabled, and exception states as relevant.
          </li>
          <li>Include text-based feedback and clear recovery.</li>
          <li>
            Validate keyboard access, contrast, and responsive behavior in real
            code.
          </li>
        </ul>
      </section>
      {data.guideImage && (
        <section className="docs-section">
          <h2>Original guidance</h2>
          <SourcePreview images={[data.guideImage]} />
        </section>
      )}
      <section className="docs-section">
        <h2>Public scope</h2>
        <p>
          This documentation presents curated source evidence and illustrative
          interactions. It is not a complete mirror, an editable library, or a
          downloadable production package. Source frameworks retain their
          credit. Adoption, code synchronization, accessibility conformance, and
          measured impact are not claimed.
        </p>
      </section>
    </>
  );
}
function SourcePreview({ images, labels }) {
  const [index, setIndex] = useState(0),
    [failed, setFailed] = useState(false);
  const item = images[index];
  return (
    <figure className="docs-source">
      {images.length > 1 && (
        <fieldset>
          <legend>Inspect original design examples</legend>
          <div>
            {images.map((img, i) => (
              <label key={img.src}>
                <input
                  type="radio"
                  name={`source-${images[0].src}`}
                  checked={index === i}
                  onChange={() => {
                    setIndex(i);
                    setFailed(false);
                  }}
                />
                {labels?.[i] || `Example ${i + 1}`}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="docs-source-media">
        {failed ? (
          <p role="status">
            This source preview couldn’t load.{" "}
            <button onClick={() => setFailed(false)}>Try again</button> or
            choose another example.
          </p>
        ) : (
          <a
            href={item.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open full-size design: ${item.alt}`}
            style={{ maxWidth: item.width }}
          >
            <img
              key={item.src}
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading="lazy"
              onError={() => setFailed(true)}
            />
          </a>
        )}
      </div>
      <figcaption>
        Original exported design. Open to inspect at full size. Source
        appearance is preserved; private editable files are not linked.
      </figcaption>
    </figure>
  );
}
function ComponentDocumentation({ system, component, theme }) {
  return (
    <>
      <section className="docs-section docs-first-section">
        <h2>{component.anatomy ? "Anatomy" : "Component model"}</h2>
        {component.anatomy && (
          <div className="docs-anatomy">
            <span className="docs-demo-solid">
              <Plus size={16} />
              <span>Save changes</span>
              <ArrowRight size={16} />
            </span>
            <div>
              {component.anatomy.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        )}
        <p>{component.model}</p>
      </section>
      {component.demo && (
        <section className="docs-section">
          <div className="docs-section-heading">
            <h2>Try the component</h2>
            <span>Illustrative interaction</span>
          </div>
          {component.demo === "button" ? (
            <ButtonDemo system={system} component={component} theme={theme} />
          ) : component.demo === "input" ? (
            <InputDemo />
          ) : component.demo === "upload" ? (
            <UploadDemo />
          ) : (
            <StepperDemo />
          )}
          <p className="docs-note">
            Native example only. No live account action, production service, or
            source-code parity is implied.
          </p>
        </section>
      )}
      {component.sizes && (
        <section className="docs-section">
          <h2>Variants & sizes</h2>
          <div className="docs-comparison">
            <div>
              <h3>Source model</h3>
              <p>{component.variants.join(" · ")}</p>
            </div>
            <div>
              <h3>Source size names</h3>
              <div className="docs-size-list">
                {component.sizes.map((s) => (
                  <code key={s}>{s}</code>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {component.images && (
        <section className="docs-section">
          <h2>Original specimens</h2>
          <SourcePreview images={component.images} labels={component.labels} />
        </section>
      )}
      <section className="docs-section" id="docs-usage">
        <h2>Usage</h2>
        {component.demo === "button" && (
          <>
            <div className="docs-comparison docs-usage-examples">
              <div>
                <h3>
                  <Check size={17} /> Do: name the outcome
                </h3>
                <span
                  className="docs-example-action"
                  style={{
                    background:
                      system === "accelbyte"
                        ? theme === "dark"
                          ? "#1F79FF"
                          : "#0B6CFF"
                        : system === "saphyte-eafghans"
                          ? "#5D42E6"
                          : "var(--doc-ink)",
                    color:
                      system === "client-portal" ? "var(--doc-bg)" : "#FFFFFF",
                  }}
                >
                  Save changes
                </span>
                <p>
                  A concise verb tells someone what happens next. Reserve strong
                  emphasis for the primary task.
                </p>
              </div>
              <div>
                <h3>
                  <X size={17} /> Avoid: vague instructions
                </h3>
                <span className="docs-example-action docs-example-avoid">
                  Click here
                </span>
                <p>
                  A generic label hides the result. Use a link instead when the
                  purpose is navigating to a destination.
                </p>
              </div>
            </div>
            <p className="docs-note">
              Illustrative label comparison, not a pair of production controls.
            </p>
          </>
        )}
        <div className="docs-comparison">
          <div>
            <h3>
              <Check size={17} /> Choose deliberately
            </h3>
            <ul>
              {component.usage.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Keep the limits visible</h3>
            <p>
              Source properties and screenshots document design intent. Validate
              the supported combinations and interaction behavior in the
              implementation before treating them as a guarantee.
            </p>
            <Link to={docsPath(system, "guidelines")}>
              Read usage guidelines <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
function ButtonDemo({ system, component, theme }) {
  const [brand, setBrand] = useState("saphyte"),
    [variant, setVariant] = useState(component.variants[0]),
    [state, setState] = useState("Default"),
    [status, setStatus] = useState("");
  const isCore = system === "saphyte-eafghans";
  const pigment = isCore
    ? brand === "saphyte"
      ? "#5D42E6"
      : "#075FD8"
    : system === "accelbyte"
      ? theme === "dark"
        ? "#1F79FF"
        : "#0B6CFF"
      : theme === "dark"
        ? "#B7BECA"
        : "#354050";
  const fg =
    theme === "dark"
      ? isCore
        ? brand === "saphyte"
          ? "#B8A9FF"
          : "#8CBCFF"
        : "#8CBCFF"
      : pigment;
  const solid = ["Solid", "Primary"].includes(variant),
    subtle = ["Subtle", "Surface"].includes(variant),
    outline = ["Outline", "Surface", "Secondary"].includes(variant);
  return (
    <>
      <div className="docs-demo-controls">
        {isCore && (
          <label>
            Brand
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="saphyte">Saphyte</option>
              <option value="eafghan">E-Afghan</option>
            </select>
          </label>
        )}
        <label>
          Variant
          <select value={variant} onChange={(e) => setVariant(e.target.value)}>
            {component.variants.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          State
          <select value={state} onChange={(e) => setState(e.target.value)}>
            {component.states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="docs-demo-stage">
        <button
          className={`docs-demo-button ${state === "Hover" ? "docs-demo-hover" : ""}`}
          disabled={state === "Disabled"}
          style={{
            background: solid
              ? pigment
              : subtle
                ? `${pigment}20`
                : "transparent",
            color: solid
              ? system === "client-portal" && theme === "dark"
                ? "#0D1118"
                : "#FFFFFF"
              : fg,
            borderColor: outline ? fg : "transparent",
            textDecoration: variant === "Plain" ? "underline" : undefined,
            transform: state === "OnClicked" ? "translateY(1px)" : undefined,
          }}
          onClick={() => setStatus("Preview only. No changes were saved.")}
        >
          Save changes
        </button>
        <p role="status">{status || `${variant} · ${state} state`}</p>
      </div>
    </>
  );
}
function InputDemo() {
  const [value, setValue] = useState(""),
    [state, setState] = useState("Default");
  const invalid = state === "Invalid";
  return (
    <>
      <div className="docs-demo-controls">
        <label>
          Example state
          <select value={state} onChange={(e) => setState(e.target.value)}>
            {["Default", "Focus", "Disabled", "Invalid", "Filled"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="docs-demo-stage">
        <div className="docs-input-demo">
          <label htmlFor="docs-example-input">Project name</label>
          <input
            id="docs-example-input"
            value={state === "Filled" ? value || "Public preview" : value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a project name"
            disabled={state === "Disabled"}
            aria-invalid={invalid}
            aria-describedby="docs-field-help"
            className={state === "Focus" ? "docs-focus-example" : ""}
          />
          <p id="docs-field-help">
            {invalid
              ? "Example error: enter a project name before continuing."
              : "Illustrative field. This value is not saved."}
          </p>
        </div>
      </div>
    </>
  );
}
function UploadDemo() {
  const [name, setName] = useState("");
  const input = useRef(null);
  return (
    <div className="docs-demo-stage">
      <div className="docs-upload-demo">
        <label htmlFor="docs-file">Choose an example image</label>
        <p>PNG or JPEG · local selection preview only</p>
        <input
          ref={input}
          id="docs-file"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => setName(e.target.files?.[0]?.name || "")}
        />
        <p role="status">
          {name
            ? `Selected: ${name}`
            : "No file selected. Nothing is uploaded."}
        </p>
        {name && (
          <button
            onClick={() => {
              setName("");
              input.current.value = "";
            }}
          >
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}
function StepperDemo() {
  const [step, setStep] = useState(0);
  return (
    <div className="docs-demo-stage">
      <ol className="docs-stepper" aria-label="Synthetic preview steps">
        {["Details", "Review", "Complete"].map((s, i) => (
          <li
            key={s}
            className={i === step ? "current" : i < step ? "finished" : ""}
            aria-current={i === step ? "step" : undefined}
          >
            <span>{i < step ? <Check size={16} /> : i + 1}</span>
            <b>{s}</b>
            <small>
              {i === step ? "Current" : i < step ? "Finished" : "Default"}
            </small>
          </li>
        ))}
      </ol>
      <div className="docs-step-actions">
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Previous
        </button>
        <button disabled={step === 2} onClick={() => setStep((s) => s + 1)}>
          Next step
        </button>
        <button onClick={() => setStep(0)}>Reset</button>
      </div>
      <p role="status">
        Synthetic sequence: {step + 1} of 3. No real workflow is submitted.
      </p>
    </div>
  );
}
