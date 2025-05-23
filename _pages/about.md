---
permalink: /
title: ""
excerpt: ""
author_profile: true
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

<span class='anchor' id='about-me'></span>

I am currently a third-year undergraduate student at the **The University of Hong Kong**, pursuing a Bachelor of Science degree. I am fortunate to be conducting research at the Multisensory Machine Intelligence Lab at the **University of Maryland**, under the guidance of Ph.D. mentor [Kelin Yu](https://colinyu1.github.io/) and [Prof. Ruohan Gao](https://ruohangao.github.io/). I would like to express my deep gratitude to Dr. [Shixiang Tang](https://tangshixiang.github.io/) and Prof. [Wanli Ouyang](https://wlouyang.github.io/) for introducing me to the world of research, especially during the early stages when I had no prior experience.

My research interests primarily focus on **multisensory intelligence** and **generative models**.

I am always excited to connect and collaborate with people from diverse backgrounds. If you’re interested in my work or would like to collaborate, feel free to reach out via email!


 

# Publications 

.paper-box {
  display: flex;
  align-items: flex-start; /* 顶部对齐 */
  border-bottom: 1px solid #efefef;
  padding: 2em 0;
  gap: 2em; /* 图片和文字间距 */

  .paper-box-image {
    position: relative;
    flex-shrink: 0; /* 防止图片缩小 */
    max-width: 400px;

    img.small-teaser {
      width: 100%;
      height: auto;
      display: block;
      box-shadow: 3px 3px 6px #888;
      object-fit: cover;
    }

    .badge {
      position: absolute;
      top: 0.5em;
      left: 0.5em;
      padding: 0.2em 0.6em;
      background-color: #00369f;
      color: white;
      font-size: 0.8em;
      border-radius: 0.2em;
      z-index: 10;
      user-select: none;
    }
  }

  .paper-box-text {
    max-width: calc(100% - 420px); /* 留点空间给图片+间距 */
    p {
      margin: 0.5em 0;
      line-height: 1.4;
    }
    a {
      color: #00369f;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}




# Experience
- *2022.08 - 2026.06 (expected)*, Bachelor of Science, The University of Hong Kong
- *2025.01 - 2025.05*， Exchange Student, University of Maryland
 

