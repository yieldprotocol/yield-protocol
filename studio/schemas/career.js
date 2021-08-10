export default {
  name: "career",
  title: "Career Listing",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Some frontend will require a slug to be set to be able to show the post",
      options: {
        source: "title",
        maxLength: 96
      }
    },
    {
      name: "publishedAt",
      title: "Published at",
      description: "You can use this field to schedule post where you show them",
      type: "datetime"
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text"
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: "apply",
      title: "Apply link (optional)",
      description: "Add a link to apply for this role, by default it'll open an email window going to `contact@yield.is`",
      type: "url"
    },
  ],
  orderings: [
    {
      title: "Publishing date new–>old",
      name: "publishingDateAsc",
      by: [{ field: "publishedAt", direction: "asc" }, { field: "title", direction: "asc" }]
    },
    {
      title: "Publishing date old->new",
      name: "publishingDateDesc",
      by: [{ field: "publishedAt", direction: "desc" }, { field: "title", direction: "asc" }]
    }
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt"
    },
    prepare({ title = "No title", publishedAt }) {
      return {
        title,
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString()
          : "Missing publishing date"
      };
    }
  }
};
