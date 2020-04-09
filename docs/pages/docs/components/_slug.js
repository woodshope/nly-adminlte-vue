import NlyAnchoredHeading from "../../../components/NlyAnchoredHeading";
import Componentdoc from "~/components/componentdoc";
import NlyImportDoc from "../../../components/NlyImportDoc";
import MainDocs from "~/components/main-docs";
import Section from "~/components/section";
import docsMixin from "~/plugins/docs-mixin";
import { components as componentsMeta } from "~/content";

const getReadMe = name =>
  import(
    `~/../src/components/${name}/README.md` /* webpackChunkName: "docs/components" */
  );

// @vue/component
export default {
  name: "BDVComponents",
  layout: "docs",
  mixins: [docsMixin],
  validate({ params }) {
    return Boolean(componentsMeta[params.slug]);
  },
  async asyncData({ params }) {
    console.log(111, params);
    const readme = (await getReadMe(params.slug)).default;
    const meta = componentsMeta[params.slug];
    return { meta, readme };
  },
  render(h) {
    // Reference section
    const $referenceSection = h(
      Section,
      { class: ["bd-component-reference"] },
      [
        // Heading
        h(
          NlyAnchoredHeading,
          { props: { id: "component-reference" } },
          "Component reference"
        ),
        // Component reference information
        ...this.meta.components.map(
          ({
            component,
            events,
            rootEventListeners,
            slots,
            aliases,
            props: propsMeta,
            version
          }) =>
            h(Componentdoc, {
              props: {
                component,
                events,
                rootEventListeners,
                slots,
                aliases,
                propsMeta,
                version
              }
            })
        ),
        // Component importing information
        h(NlyImportDoc, { props: { meta: this.meta } })
      ]
    );

    return h(
      MainDocs,
      {
        key: this.$route.path,
        staticClass: "bd-components",
        props: {
          readme: this.readme || "",
          meta: this.meta
        }
      },
      [$referenceSection]
    );
  }
};
