// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// We import object and document schemas
import about from "./about";
import blockContent from "./blockContent";
import blockText from "./blockText";
import career from "./career";
import category from "./category";
import companyInfo from "./companyInfo";
import figure from "./figure";
import home from "./home";
import mainImage from "./mainImage";
import mission from "./mission";
import page from "./page";
import paper from "./paper";
import person from "./person";
import post from "./post";
import postAuthor from "./postAuthor";
import siteSettings from "./siteSettings";
import slideshow from "./slideshow";
import social from "./social";
import stat from "./stat";
import story from "./story";
import storyMember from "./storyMember";
import value from "./value";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    about,
    blockContent,
    blockText,
    career,
    category,
    companyInfo,
    figure,
    home,
    mainImage,
    mission,
    page,
    paper,
    person,
    post,
    postAuthor,
    siteSettings,
    slideshow,
    social,
    stat,
    story,
    storyMember,
    value,

    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
  ])
});
