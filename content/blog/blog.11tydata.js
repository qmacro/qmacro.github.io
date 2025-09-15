export default {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	"permalink": "/blog/posts/{{ date | dateToSlashSeparatedYMD }}/{{ title | slugify }}/"
};
