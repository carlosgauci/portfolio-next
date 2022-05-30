import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import NavModal from "../components/NavModal";
import { AnimatePresence } from "framer-motion";
import { base } from "../utils/airtable";
import About from "../components/About";
import Skills from "../components/Skills";

export default function Home({ about, skills, projects }) {
  const [navOpen, setNavOpen] = useState(false);
  const [navItemSelected, setNavItemSelected] = useState(0);

  useEffect(() => {
    //disable scroll when nav is open
    const html = document.querySelector("html");
    navOpen
      ? (html.style.overflow = "hidden")
      : (html.style.overflow = "visible");
  }, [navOpen]);

  // console.log(skills);

  return (
    <div>
      <Head>
        <title>Carlos Gauci | Web Developer</title>
        <meta
          name="description"
          content="Fullstack web developer specializing in Javascript."
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header
        setNavOpen={setNavOpen}
        navItemSelected={navItemSelected}
        setNavItemSelected={setNavItemSelected}
      />

      <main>
        <About about={about[0].fields} />
        <Skills skills={skills} />
      </main>
      <footer>footer</footer>

      {/* Nav */}
      <AnimatePresence>
        {navOpen && (
          <NavModal
            setNavOpen={setNavOpen}
            navItemSelected={navItemSelected}
            setNavItemSelected={setNavItemSelected}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export async function getStaticProps() {
  let about = await base("About").select({}).firstPage();
  about = about.map((r) => ({ id: r?.id, fields: r?.fields }));

  let skills = await base("Skills").select({}).firstPage();
  skills = skills
    .filter((s) => s?.fields?.published)
    .map((s) => ({ id: s?.id, fields: s?.fields }));

  let projects = await base("Projects").select({}).firstPage();
  projects = projects
    .filter((p) => p?.fields?.enabled)
    .map((p) => ({ id: p?.id, fields: p?.fields }));

  return {
    props: {
      about,
      skills,
      projects,
    },
  };
}
