# Portfolio

A full-stack personal portfolio website with a public-facing site and a secured admin panel for managing content. Built with React on the frontend and Spring Boot on the backend, backed by MongoDB.

**Live site:** https://portfolio-frontend-linker.vercel.app

---

## Features

- **Hero, About, Skills, Projects, Education, Experience** sections — all content editable through an admin panel, no code changes needed to update
- **Contact form** — visitors can submit messages directly from the site
- **Admin panel** — secured with JWT authentication, lets the owner add/edit content and view contact form submissions
- **Matrix-style animated background** for a distinct visual identity
- **Fully responsive** across desktop and mobile
- **Scroll-reveal animations** on section content

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Axios
- SweetAlert2 (form feedback alerts)
- React Icons
- Plain CSS (component-scoped stylesheets)

**Backend**
- Java 17 + Spring Boot
- Spring Security + JWT (`jjwt`) for admin authentication
- Spring Data MongoDB
- MongoDB Atlas (cloud database)

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```
PortfolioFrontendLinker/
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── AboutAdmin.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── BackendLoader.jsx
│   │   ├── Contact.jsx
│   │   ├── ContactAdmin.jsx
│   │   ├── Education.jsx
│   │   ├── EducationAdmin.jsx
│   │   ├── Experience.jsx
│   │   ├── ExperienceAdmin.jsx
│   │   ├── Hero.jsx
│   │   ├── HeroAdmin.jsx
│   │   ├── MatrixRain.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectsAdmin.jsx
│   │   ├── Skills.jsx
│   │   └── SkillsAdmin.jsx
│   ├── styles/
│   │   ├── AboutAdmin.css
│   │   ├── AdminHero.css
│   │   ├── AdminPanel.css
│   │   ├── AdminProjects.css
│   │   ├── AdminSkills.css
│   │   ├── ContactAdmin.css
│   │   ├── Education.css
│   │   ├── Experience.css
│   │   ├── about.css
│   │   ├── admin.css
│   │   ├── contact.css
│   │   ├── educationAdmin.css
│   │   ├── experienceAdmin.css
│   │   ├── global.css
│   │   ├── hero.css
│   │   ├── navbar.css
│   │   ├── projects.css
│   │   └── skills.css
│   └── App.jsx
└── package.json

PortfolioBackendLinker/
├── src/main/java/com/MainApp/
│   ├── Entity/
│   │   ├── About.java
│   │   ├── Admin.java
│   │   ├── Contact.java
│   │   ├── ContactMessage.java
│   │   ├── Education.java
│   │   ├── Experience.java
│   │   ├── Hero.java
│   │   ├── Projects.java
│   │   └── Skills.java
│   ├── Repository/
│   │   ├── AboutRepository.java
│   │   ├── AdminRepository.java
│   │   ├── ContactMessageRepository.java
│   │   ├── ContactRepository.java
│   │   ├── EducationRepository.java
│   │   ├── ExperienceRepository.java
│   │   ├── HeroRepository.java
│   │   ├── ProjectRepo.java
│   │   └── SkillsRepository.java
│   ├── Service/
│   │   ├── AboutService.java
│   │   ├── ContactMessageService.java
│   │   ├── ContactService.java
│   │   ├── EducationService.java
│   │   ├── ExperienceService.java
│   │   ├── HeroService.java
│   │   ├── ProjectService.java
│   │   └── SkillsService.java
│   ├── Controller/
│   │   ├── AboutController.java
│   │   ├── AdminAuthController.java
│   │   ├── ContactController.java
│   │   ├── EducationController.java
│   │   ├── ExperienceController.java
│   │   ├── HeroController.java
│   │   ├── ProjectController.java
│   │   └── SkillsController.java
│   └── security/
│       ├── CustomAdminDetails.java
│       ├── CustomAdminDetailsService.java
│       ├── JwtFilter.java
│       ├── JwtUtil.java
│       ├── PasswordEncoderConfig.java
│       └── SecurityConfig.java
└── pom.xml
```

---

## License

This project is for personal portfolio use. Feel free to fork and adapt for your own portfolio.
