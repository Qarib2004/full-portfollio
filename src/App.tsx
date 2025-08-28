import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code,
  Database,
  Server,
  Globe,
  Monitor,
  Eye,
} from "lucide-react";
import { useState } from "react";
import ProjectModal from "./ProjectModal";

function App() {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');


  const skills = {
    frontend: [
      { name: "React", level: "Junior" },
      { name: "TypeScript", level: "Junior" },
      { name: "JavaScript", level: "Junior" },
      { name: "Next.js", level: "Junior", badge: "Learning" },
      { name: "HTML/CSS", level: "Junior" },
      { name: "Tailwind CSS", level: "Junior" },
      { name: "Redux", level: "Junior" },
      { name: "Shadcn", level: "Junior", badge: "Learning" },
    ],
    backend: [
      { name: "Java", level: "Junior" },
      { name: "Spring Boot", level: "Junior" },
      { name: "Node.js", level: "Junior" },
      { name: "Nest.js", level: "Junior", badge: "Learning" },
      { name: "PostgreSQL", level: "Junior" },
      { name: "MongoDB", level: "Junior" },
      { name: "REST APIs", level: "Junior" },
    ],
    tools: [
      { name: "Git/GitHub", level: "Junior" },
      { name: "Docker", level: "Junior" },
      { name: "Postman", level: "Junior" },
      { name: "Vite", level: "Junior" },
    ],
  };

  const projectImages = {
    "Reddit Clone": [
      "/reddit-images/admin panel - community page.png",
      "/reddit-images/admin panel - content page 2.png",
      "/reddit-images/admin panel - content page.png",
      "/reddit-images/admin panel - request moderator page.png",
      "/reddit-images/moderator panel - reported comment page.png",
      "/reddit-images/moderator panel - reported post page.png",
      "/reddit-images/moderator panel.png",
      "/reddit-images/reddit - community page.png",
      "/reddit-images/reddit - messages and chats page.png",
      "/reddit-images/reddit - profile page.png",
      "/reddit-images/reddit - saved page.png",
      "/reddit-images/reddit - settings page 2.png",
      "/reddit-images/reddit - settings page.png",
      "/reddit-images/reddit-create  ppost page.png",
      "/reddit-images/reddit-home page.png",
      "/reddit-images/reddit-login page.png",
      "/reddit-images/reddit-subscribed page.png",
      "/reddit-images/responcive desighn 2.png",
      "/reddit-images/responcive design.png",
    ],
    "React Classroom Project": [
      // Добавьте пути к изображениям для этого проекта
    ],
    "Commerce Backend": [
      // Добавьте пути к изображениям для этого проекта
    ],
    "NeoShop": [
      "/neoshop-images/NeoShop - basket.png",
      "/neoshop-images/NeoShop - catalog page.png",
      "/neoshop-images/NeoShop - craete categories page.png",
      "/neoshop-images/NeoShop - create goods page.png",
      "/neoshop-images/NeoShop - favorites page.png",
      "/neoshop-images/NeoShop - home page.png",
      "/neoshop-images/NeoShop - product page 2.png",
      "/neoshop-images/NeoShop - product page.png",
      "/neoshop-images/NeoShop - responcive 2.png",
      "/neoshop-images/NeoShop - responcive.png",
      "/neoshop-images/NeoShop - settings store page.png",
      "/neoshop-images/NeoShop - store categories page.png",
      "/neoshop-images/NeoShop - store colors page.png",
      "/neoshop-images/NeoShop - store goods page.png",
      "/neoshop-images/NeoShop - store statistics page.png",
      "/neoshop-images/NeoShop- crate colors page.png",
      "/neoshop-images/NeoShop- login page.png",

    ],
    "Cinefy": [
      // Добавьте пути к изображениям для этого проекта
    ],
  };


  const projects = [
    {
      title: "Reddit Clone",
      description:
        "Full-featured Reddit clone with user authentication, post creation, voting system, and real-time comments.Panel:admin,moderator,user",
      tech: [
        "React",
        "Node.js",
        "MongoDB",
        "Socket.io",
        "OAuth 2.0 Google",
        "Nodemailer",
      ],
      github: "https://github.com/Qarib2004/reddit",
      status: "Completed",
    },
    {
      title: "React Classroom Project",
      description:
        "Educational platform for managing classroom activities, assignments, and student-teacher interactions.",
      tech: ["React", "JavaScript", "Redux", "REST API", "Socket.io"],
      github: "https://github.com/nurlan1717/react-classroom-project",
      status: "Completed",
      live_demo:"https://react-classroom-project.vercel.app/"
    },
    {
      title: "Commerce Backend",
      description:
        "Robust e-commerce backend with Java Spring Boot, featuring product management, user authentication, and order processing.",
      tech: ["Java", "Spring Boot", "PostgreSQL", "JWT"],
      github: "https://github.com/Qarib2004/commerce-back-java",
      status: "Completed",
    },
    {
      title: "NeoShop",
      description:
        "Modern e-commerce platform built with Next.js frontend and Nest.js backend, featuring Junior product catalog and user management.",
      tech: [
        "Next.js",
        "Nest.js",
        "TypeScript",
        "PostgreSQL",
        "Shadcn",
        "Google OAuth 2.0",
        "Prisma",
        "PostgreSQL",
        "DOCKER",
        'TailwindCSS',
       ' Stripe'
      ],
      github: "https://github.com/Qarib2004/NeoShop",
      status: "Completed",
    },
    {
      title: "Cinefy",
      description:
        "A modern movie streaming platform built with Next.js (frontend) and Nest.js (backend). Features include movie catalog, genre-based browsing, user authentication.Panel:admin,user.",
      tech: [
        "Next.js",
        "Nest.js",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "Docker",
        'TailwindCSS',
        'Stripe'
      ],
      github: "https://github.com/Qarib2004/cinefy-project",
      status: "İn Progress",
      deploy: "Frontend:Vercel,Backend:Render,Database:Neon Console",
      live_demo: "https://cinefy-project.vercel.app/",
    },
  ];


  const openModal = (projectTitle: string) => {
    setSelectedProject(projectTitle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject('');
  };



  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QA
            </div>
            <div className="hidden md:flex space-x-8">
              {["About", "Skills", "Projects", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-emerald-900/20"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Qarib Alisultanov
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-slate-300 mb-8 font-medium">
              Fullstack Developer
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Passionate about crafting exceptional digital experiences with
              modern technologies. Specializing in React,Node.js, Java Spring
              Boot, and building scalable web applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("projects")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold
                          hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300
                          shadow-lg hover:shadow-xl"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-4 border-2 border-slate-700 rounded-xl font-semibold
                          hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                I'm a passionate fullstack developer currently pursuing
                Information Technology at Azerbaijan University of Architecture
                and Construction. With a strong foundation in both frontend and
                backend technologies, I love creating innovative solutions that
                make a difference.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                My journey in software development has led me through various
                technologies, from building responsive React and Node.js
                applications to developing robust backend systems with Java
                Spring Boot. I'm always eager to learn new technologies and take
                on challenging projects.
              </p>
              <div className="flex items-center space-x-2 text-emerald-400">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">Yasamal, Baku, Azerbaijan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-center">
                  <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Code Academy
                  </h3>
                  <p className="text-slate-400">
                    Completed Software Engineering Diploma (MERN stack)
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                <div className="text-center">
                  <Database className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Codders
                  </h3>
                  <p className="text-slate-400">Java Backend Program</p>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Commitment
                  </h3>
                  <p className="text-slate-400">100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Skills & Juniorise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-emerald-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Frontend Skills */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <Monitor className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Frontend</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {skills.frontend.map((skill, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <span className="text-slate-200 font-medium text-sm mb-2 block">
                        {skill.name}
                      </span>
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            skill.level === "95%" || skill.level === "90%"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : skill.level === "85%"
                              ? "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                              : "bg-blue-300/20 text-blue-300 border border-blue-300/30"
                          }`}
                        >
                          Junior
                        </span>
                        {skill.badge && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              skill.badge === "New"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            }`}
                          >
                            {skill.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <Server className="w-8 h-8 text-emerald-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Backend</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {skills.backend.map((skill, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <span className="text-slate-200 font-medium text-sm mb-2 block">
                        {skill.name}
                      </span>
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            skill.level === "90%" || skill.level === "85%"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : skill.level === "80%"
                              ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                              : "bg-emerald-300/20 text-emerald-300 border border-emerald-300/30"
                          }`}
                        >
                          {skill.level === "90%" || skill.level === "85%"
                            ? "Junior"
                            : "Junior"}
                        </span>
                        {skill.badge && (
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {skill.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Technologies */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <Database className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">
                  Tools & DevOps
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {skills.tools.map((skill, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <span className="text-slate-200 font-medium text-sm mb-2 block">
                        {skill.name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          skill.level === "85%" || skill.level === "80%"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : skill.level === "75%"
                            ? "bg-purple-400/20 text-purple-300 border border-purple-400/30"
                            : "bg-purple-300/20 text-purple-300 border border-purple-300/30"
                        }`}
                      >
                        {skill.level === "85%" || skill.level === "80%"
                          ? "Junior"
                          : "Junior"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 
                          hover:border-slate-600/50 transition-all duration-300 group hover:transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        project.status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium
                               hover:bg-slate-600/50 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.deploy && (
                  <div className="mb-6 text-sm text-slate-400">
                    <span className="font-medium text-slate-300">Deploy:</span>{" "}
                    {project.deploy}
                  </div>
                )}

                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300
                             hover:bg-slate-700/50 px-4 py-2 rounded-lg"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={project.live_demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300
             hover:bg-slate-700/50 px-4 py-2 rounded-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                  <button
                    onClick={() => openModal(project.title)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300
                             hover:bg-blue-600/20 hover:border-blue-500/30 border border-slate-600/30 px-4 py-2 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Details</span>
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto"></div>
            <p className="text-xl text-slate-400 mt-6 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities and interesting
              projects. Let's connect and build something amazing together!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div
                className="flex items-center space-x-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl 
                            border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                  <p className="text-slate-300">garibalisultanov@gmail.com</p>
                </div>
              </div>

              <div
                className="flex items-center space-x-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl 
                            border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Phone</h3>
                  <p className="text-slate-300">+994 77 611 28 88</p>
                </div>
              </div>

              <div
                className="flex items-center space-x-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl 
                            border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Location</h3>
                  <p className="text-slate-300">Yasamal, Baku, Azerbaijan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Qarib Alisultanov
              </h3>
              <p className="text-slate-400">Fullstack Developer</p>
            </div>

            <div className="flex space-x-6">
              <a
                href="https://github.com/Qarib2004"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center
                         transition-all duration-300 hover:transform hover:scale-110 group"
              >
                <Github className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/garib-alisultanov-115816325"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center
                         transition-all duration-300 hover:transform hover:scale-110 group"
              >
                <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a
                href="mailto:garibalisultanov@gmail.com"
                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center
                         transition-all duration-300 hover:transform hover:scale-110 group"
              >
                <Mail className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
            <p className="text-slate-400">
              © 2025 Qarib Alisultanov. Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>

      <ProjectModal
        isOpen={modalOpen}
        onClose={closeModal}
        projectTitle={selectedProject}
        images={projectImages[selectedProject as keyof typeof projectImages] || []}
      />
    </div>
  );
}

export default App
