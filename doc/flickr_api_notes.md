

min_upload_date: Math.ceil(this.start.valueOf() / 1000), // results match criteria
max_upload_date: Math.ceil(this.end.valueOf() / 1000),
min_upload_date: this.start.formatPST("YYYY-MM-DD HH:mm:ss"), // results match criteria
max_upload_date: this.end.formatPST("YYYY-MM-DD HH:mm:ss"),
min_upload_date: this.start.format("YYYY-MM-DD HH:mm:ss"), // results 3 hours later
max_upload_date: this.end.format("YYYY-MM-DD HH:mm:ss"),
min_upload_date: this.start.formatUTC("YYYY-MM-DD HH:mm:ss"), // results 8 hours later
max_upload_date: this.end.formatUTC("YYYY-MM-DD HH:mm:ss"),

- taken_date is searched based on raw time from camera, regardless of time zone
- no way to know if taken_date is in time zone of photo or user profile
- flickr results are offset from search criteria by 5 hours (don't know why)

if we assume taken_date is in time zone of photo:
- manipulate start/end using the diff of browser timezone to timezone of map center
- subtract 5 more hours from start/end to make up for unexplainable offset

min_taken_date: this._adjustTime(this.start), // results match criteria
max_taken_date: this._adjustTime(this.end),
min_taken_date: Math.ceil(this.start.valueOf() / 1000), // results 5 hours later
max_taken_date: Math.ceil(this.end.valueOf() / 1000),
min_taken_date: this.start.formatPST("YYYY-MM-DD HH:mm:ss"), // results 5 hours later
max_taken_date: this.end.formatPST("YYYY-MM-DD HH:mm:ss"),
min_taken_date: this.start.format("YYYY-MM-DD HH:mm:ss"), // results 8 hours later
max_taken_date: this.end.format("YYYY-MM-DD HH:mm:ss"),
min_taken_date: this.start.formatUTC("YYYY-MM-DD HH:mm:ss"), // results 13 hours later
max_taken_date: this.end.formatUTC("YYYY-MM-DD HH:mm:ss"),

