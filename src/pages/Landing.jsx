import {
  ArrowRight, BookOpenCheck, CalendarCheck2, CheckCircle2,
  Search, ShieldCheck, Sparkles, Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "@components/Brand";
import { useAuth } from "@context/AuthContext";

export default function Landing() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="marketing-page">
      <header className="marketing-nav">
        <Brand />
        <nav>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <Link to="/tutors">Find tutors</Link>
        </nav>
        <div className="nav-actions">
          {isLoggedIn ? (
            <Link className="button button-primary" to="/">Open dashboard</Link>
          ) : (
            <>
              <Link className="button button-ghost" to="/login">Log in</Link>
              <Link className="button button-primary" to="/signup">
                Join for free <ArrowRight size={17} />
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-pill"><Sparkles size={15} /> Extra help that fits your budget</div>
            <h1>Learn with the right tutor. <span>Grow with confidence.</span></h1>
            <p>
              EduConnect brings students and peer tutors into one focused learning space —
              subjects, bookings, and progress included.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary button-large" to="/tutors">
                <Search size={19} /> Find a tutor
              </Link>
              <Link className="button button-secondary button-large" to="/signup">
                Become a tutor
              </Link>
            </div>
            <div className="trust-row">
              <span><CheckCircle2 /> Free tutors welcome</span>
              <span><CheckCircle2 /> Flexible sessions</span>
              <span><CheckCircle2 /> Progress tracked</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="EduConnect dashboard preview">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="preview-card">
              <div className="preview-top">
                <span className="preview-logo">EC</span>
                <span>Today's learning</span>
                <span className="online-pill">Live</span>
              </div>
              <div className="preview-focus">
                <div className="preview-icon"><BookOpenCheck /></div>
                <div>
                  <small>UP NEXT · MAT101</small>
                  <h3>Quadratic equations</h3>
                  <p>With Thando M. · 14:00</p>
                </div>
              </div>
              <div className="preview-progress">
                <span><b>Course progress</b><b>72%</b></span>
                <div><i /></div>
              </div>
              <div className="preview-grid">
                <div><CalendarCheck2 /><b>6</b><span>Sessions</span></div>
                <div><Star /><b>4.9</b><span>Avg. rating</span></div>
                <div><ShieldCheck /><b>12</b><span>Updates</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="logo-strip">
          <span>Built for connected learning</span>
          <b>STUDENTS</b><b>PEER TUTORS</b>
        </section>

        <section id="how" className="marketing-section">
          <div className="section-heading">
            <span className="eyebrow">A simpler learning journey</span>
            <h2>From finding help to tracking progress</h2>
            <p>Every step lives in one place.</p>
          </div>
          <div className="steps-grid">
            <article>
              <span>01</span><Search /><h3>Choose your subject</h3>
              <p>Discover tutors who teach what you need.</p>
            </article>
            <article>
              <span>02</span><CalendarCheck2 /><h3>Book a session</h3>
              <p>Request a convenient time and let your tutor respond.</p>
            </article>
            <article>
              <span>03</span><BookOpenCheck /><h3>Learn and improve</h3>
              <p>Join online and review your progress.</p>
            </article>
          </div>
        </section>

        <section id="features" className="feature-band">
          <div>
            <span className="eyebrow">Everything connected</span>
            <h2>Designed around real tutoring work</h2>
          </div>
          <div className="feature-list">
            {[
              "Affordable and free tutor listings",
              "Session messaging and video links",
              "Subject-based tutor discovery",
              "Reviews and reputation",
            ].map((f) => <span key={f}><CheckCircle2 />{f}</span>)}
          </div>
        </section>
      </main>

      <footer className="marketing-footer">
        <Brand />
        <p>Helping students learn together, one session at a time.</p>
        <span>© 2026 EduConnect</span>
      </footer>
    </div>
  );
}