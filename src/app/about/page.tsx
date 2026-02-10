import { Metadata } from 'next';
import Link from 'next/link';
import { Code, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn more about my journey, skills, and passion for creating exceptional digital experiences.',
};

const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'] },
    { category: 'Tools & DevOps', items: ['Git', 'Docker', 'AWS', 'Vercel', 'CI/CD'] },
    { category: 'Design', items: ['Figma', 'UI/UX Design', 'Responsive Design', 'Prototyping'] },
];

const experience = [
    {
        period: '2022 - Present',
        title: 'Senior Full-Stack Developer',
        company: 'Freelance',
        description: 'Building custom web applications and digital solutions for clients worldwide.',
    },
    {
        period: '2020 - 2022',
        title: 'Full-Stack Developer',
        company: 'Tech Company',
        description: 'Led development of multiple high-impact projects using React and Node.js.',
    },
    {
        period: '2018 - 2020',
        title: 'Frontend Developer',
        company: 'Digital Agency',
        description: 'Created responsive, performant web interfaces for diverse client projects.',
    },
];

export default function AboutPage() {
    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Hi, I&apos;m a <span className="gradient-text">Full-Stack Developer</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            I&apos;m passionate about creating beautiful, functional, and user-centric digital experiences.
                            With over 5 years of experience in web development, I combine technical expertise with
                            creative problem-solving to bring ideas to life.
                        </p>
                        <p className="text-muted-foreground mb-8">
                            When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source
                            projects, or sharing knowledge with the developer community.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all shadow-glow"
                        >
                            Get in Touch
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                                    <Code className="w-16 h-16 text-white" />
                                </div>
                                <p className="text-muted-foreground">Profile Image Placeholder</p>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
                    </div>
                </div>

                {/* Skills */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold mb-8 text-center">Skills & Technologies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skills.map((skillGroup) => (
                            <div
                                key={skillGroup.category}
                                className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                            >
                                <h3 className="font-semibold text-lg mb-4 text-primary">{skillGroup.category}</h3>
                                <ul className="space-y-2">
                                    {skillGroup.items.map((skill) => (
                                        <li key={skill} className="text-muted-foreground text-sm flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section>
                    <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
                    <div className="max-w-3xl mx-auto">
                        {experience.map((exp, index) => (
                            <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                {/* Timeline line */}
                                {index !== experience.length - 1 && (
                                    <div className="absolute left-3 top-3 bottom-0 w-px bg-border" />
                                )}
                                {/* Timeline dot */}
                                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                {/* Content */}
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <span className="text-sm text-primary font-medium">{exp.period}</span>
                                    <h3 className="font-semibold text-lg mt-1">{exp.title}</h3>
                                    <p className="text-muted-foreground text-sm">{exp.company}</p>
                                    <p className="text-muted-foreground mt-2">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
