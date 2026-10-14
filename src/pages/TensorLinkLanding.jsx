import styles from "../style";
import { useStateContext } from "../contexts/ContextProvider";
import { Example, Hero, ToPortal, TensorlinkApplications } from "../components";
import { Helmet } from "react-helmet-async";

const TensorLinkLanding = ({ activeMenu }) => {
  const { setActiveMenu } = useStateContext();

  return (
    <>
      <Helmet>
        <title>Tensorlink</title>
        <meta
          name="description"
          content="Tensorlink enables distributed neural network training using Smartnodes."
        />
        <link rel="canonical" href="https://smartnodes.ca/tensorlink" />

        {/* Brand fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code / labels) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Smartnodes",
                "item": "https://smartnodes.ca/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tensorlink",
                "item": "https://smartnodes.ca/tensorlink"
              }
            ]
          }
          `}
        </script>
      </Helmet>

      <div className={`z-20 min-h-screen flex-col ${styles.flexCenter} min-w-full`}>
        <div className="z-10 flex-col min-w-full">
          <Hero activeMenu={activeMenu} />
          <TensorlinkApplications />
          <Example activeMenu={activeMenu} />
          <ToPortal />
        </div>
      </div>
    </>
  );
};

export default TensorLinkLanding;
