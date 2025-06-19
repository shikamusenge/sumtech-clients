// src/components/SEO.jsx
import React from 'react';
import { MetaTags } from 'react-meta-tags';

const SEO = ({ title, description, keywords }) => (
  <MetaTags>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
  </MetaTags>
);

export default SEO;