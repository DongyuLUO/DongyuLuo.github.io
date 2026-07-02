---
permalink: /
title: ""
excerpt: ""
layout: home
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<section class="home-intro" id="about-me">
  <div class="home-intro__photo">
    <img src="images/me.jpg" alt="Dongyu Luo">
  </div>
  <div class="home-intro__content">
    <p class="home-intro__eyebrow">Incoming Ph.D. Student</p>
    <h1>Dongyu Luo</h1>
    <p>
      I will be pursuing my Ph.D. under the supervision of Prof.
      <a href="https://www.weiyuliu.com/">Weiyu Liu</a>. I received my bachelor's
      degree from <strong>The University of Hong Kong</strong>.
    </p>
    <p>
      During my undergraduate studies, I conducted research at the Multisensory
      Machine Intelligence Lab at the <strong>University of Maryland</strong>,
      where I was mentored by <a href="https://colinyu1.github.io/">Kelin Yu</a>
      and Prof. <a href="https://ruohangao.github.io/">Ruohan Gao</a>. I am
      deeply grateful to Dr. <a href="https://tangshixiang.github.io/">Shixiang Tang</a>
      and Prof. <a href="https://wlouyang.github.io/">Wanli Ouyang</a> for
      introducing me to research and guiding me through the early stages of my
      academic journey.
    </p>
    <p>
      My research interests primarily focus on <strong>Multisensory Intelligence</strong>
      and <strong>Robot Learning</strong>.
    </p>
    <p>
      I am always excited to connect and collaborate with people from diverse
      backgrounds. If you are interested in my work, feel free to reach out.
    </p>
    <div class="home-links" aria-label="Profile links">
      <a href="mailto:lewisluo@connect.hku.hk">Email</a>
      <a href="https://drive.google.com/file/d/1D2E56T2EJL-6eYjscP-6i6JxBdx-Cc_m/view?usp=sharing">CV</a>
      <a href="https://scholar.google.com/citations?user=NHxZZQ0AAAAJ&hl=en&oi=ao">Google Scholar</a>
      <a href="https://www.linkedin.com/in/dongyu-luo-911a4724b/">LinkedIn</a>
      <a href="https://x.com/lewisluo49?s=21&t=Gyyr18zy2nITBEm85DNWxQ">X</a>
    </div>
  </div>
</section>

<section class="home-section" id="news">
  <div class="home-section__header">
    <h2>News</h2>
  </div>

  <div class="news-list">
    <div class="news-item">
      <time>2025.10</time>
      <p>
        ControlTac is accepted by ICCV CDEL Workshop with
        <span class="news-highlight">Oral Presentation</span>.
      </p>
    </div>
  </div>
</section>

<section class="home-section" id="publications">
  <div class="home-section__header">
    <h2>Publications</h2>
  </div>

  <article class="publication">
    <div class="publication__media">
      <img src="images/teaser_0.png" alt="ControlTac tactile image generation teaser">
    </div>
    <div class="publication__body">
      <div class="publication__badges">
        <a class="badge" href="https://curateddata.github.io/">ICCV CDEL Workshop <span>(Oral)</span></a>
        <span class="badge badge--muted">Accepted</span>
      </div>
      <h3>ControlTac: Scaling Tactile Data with Physically Controlled Tactile Image Generation</h3>
      <p>
        <strong>Dongyu Luo*</strong>, <a href="https://colinyu1.github.io/">Kelin Yu*</a>,
        <a href="https://amirshahid.github.io/">Amir-Hossein Shahidzadeh</a>,
        <a href="https://users.umiacs.umd.edu/~fermulcm/">Cornelia Fermuler</a>,
        <a href="https://robotics.umd.edu/clark/faculty/350/Yiannis-Aloimonos">Yiannis Aloimonos</a>,
        <a href="https://ruohangao.github.io/">Ruohan Gao</a>.
      </p>
      <p class="publication__links">
        <a href="https://dongyuluo.github.io/controltac/">Project Page</a>
        <span>/</span>
        <a href="https://drive.google.com/file/d/1wR6StQ_NhNsdrqc0WKvcsUx7Z2zHHtTu/view?usp=sharing">Paper</a>
        <strong><span class="show_paper_citations" data="DhtAFkwAAAAJ:ALROH1vI_8AC"></span></strong>
      </p>
    </div>
  </article>
</section>

<section class="home-section" id="experience">
  <div class="home-section__header">
    <h2>Experience</h2>
  </div>

  <div class="timeline">
    <div class="timeline__item">
      <div class="institution-logo institution-logo--umd" aria-label="University of Maryland, College Park logo">UMD</div>
      <div class="timeline__content">
        <time>2025.01 - Present</time>
        <strong>Exchange Student &amp; Research Intern</strong>
        <span>University of Maryland, College Park</span>
        <span>Supervisor: Prof. <a href="https://ruohangao.github.io/">Ruohan Gao</a> and Mr. <a href="https://colinyu1.github.io/">Kelin Yu</a></span>
      </div>
    </div>
    <div class="timeline__item">
      <div class="institution-logo institution-logo--sail" aria-label="Shanghai Artificial Intelligence Laboratory logo">SAIL</div>
      <div class="timeline__content">
        <time>2024.04 - 2024.12</time>
        <strong>Research Intern</strong>
        <span>Shanghai Artificial Intelligence Laboratory</span>
        <span>Supervisor: Prof. <a href="https://wlouyang.github.io/">Wanli Ouyang</a> and Dr. <a href="https://tangshixiang.github.io/">Shixiang Tang</a></span>
      </div>
    </div>
    <div class="timeline__item">
      <div class="institution-logo institution-logo--hku" aria-label="The University of Hong Kong logo">HKU</div>
      <div class="timeline__content">
        <time>2022.09 - 2026.08</time>
        <strong>Bachelor of Science</strong>
        <span>The University of Hong Kong</span>
      </div>
    </div>
  </div>
</section>

<section class="home-section" id="service">
  <div class="home-section__header">
    <h2>Service</h2>
  </div>

  <div class="service-list">
    <p><strong>Reviewer:</strong> CoRL</p>
  </div>
</section>
