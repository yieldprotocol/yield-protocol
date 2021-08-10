export default {
  name: "stat",
  title: "Stat",
  type: "document",
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ["update", "publish", "create", "delete"],
  fields: [
    {
      name: "stat",
      title: "Stat or larger heading",
      type: "string"
    },
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "description",
      title: "Description (optional)",
      type: "text"
    },
    {
      name: "url",
      title: "URL (optional)",
      type: "url"
    },
    {
      name: "image",
      title: "Icon or image (optional)",
      type: "mainImage"
    }
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      image: "mainImage"
    },
    prepare({ title = "No title", image }) {
      return {
        title,
        media: image
      };
    }
  }
};
