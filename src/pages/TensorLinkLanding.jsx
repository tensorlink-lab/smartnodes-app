import styles from "../style";
import { useStateContext } from "../contexts/contextProvider";
import { Example, ToPortal, UseCases, WhyTensorlink } from '../components';
import { Helmet } from "react-helmet-async";


const TensorLinkLanding = () => {
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
        <div className="z-10 mt-5 sm:mt-0 flex-col min-w-full">
          <Example />
          <WhyTensorlink />
          <UseCases />
          <ToPortal />
        </div>
      </div>
    </>
  );
};

export default TensorLinkLanding;
