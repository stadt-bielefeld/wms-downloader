const
SUPPORTED_FORMATS = [ {
	"title" : "PNG",
	"fileExt" : "png",
	"worldFileExt" : "pgw",
	"mimeType" : "image/png"
}, {
	"title" : "PNG 8-Bit",
	"fileExt" : "png",
	"worldFileExt" : "pgw",
	"mime_type" : "image/png; mode=8bit"
}, {
	"title" : "JPG",
	"fileExt" : "jpg",
	"worldFileExt" : "jgw",
	"mimeType" : "image/jpeg"
}, {
	"title" : "GIF",
	"fileExt" : "gif",
	"worldFileExt" : "gfw",
	"mimeType" : "image/gif"
}, {
	"title" : "TIFF",
	"fileExt" : "tif",
	"worldFileExt" : "tfw",
	"mimeType" : "image/tiff"
} ];

function getFormatDetails(mimeType) {
	var int, f;

	// Iterate over all supported formats
	for (int = 0; int < SUPPORTED_FORMATS.length; int++) {

		// Format entry
		f = SUPPORTED_FORMATS[int];

		// Check mime type
		if (f.mimeType === mimeType) {

			// Return founded format
			return f;
		}
	}

	return null;
}

function checkOptions(options) {
	var errorName = 'InvalidOptions';

	if (options) {

		if (options.task) {

			if (options.task.id) {
				if (isString(options.task.id)) {

				} else {
					throw {
						name : errorName,
						message : 'Options.task.id is not a string.'
					}
				}
			} else {
				// options.task.id is optional

				// Create a id
				options.task.id = createTaskId();

			}

			if (options.task.title) {

				if (isString(options.task.title)) {

				} else {
					throw {
						name : errorName,
						message : 'Options.task.title is not a string.'
					}
				}
			} else {
				// options.task.title is optional

				// Create a title
				options.task.title = options.task.id;
			}

			if (options.task.format) {
				if (isString(options.task.format)) {
					if (isFormatSupported(options.task.format)) {

					} else {
						throw {
							name : errorName,
							message : 'Options.task.format "' + options.task.format + '" is not supported.'
						}
					}

				} else {
					throw {
						name : errorName,
						message : 'Options.task.format is not a string.'
					}
				}
			} else {
				options.task.format = 'image/png';

			}

			// if (options.task.crs) {
			// if (isString(options.task.crs)) {
			// if (isCRS(options.task.crs)) {
			//
			// } else {
			// throw {
			// name : errorName,
			// message : 'Options.task.crs "' + options.task.crs + '" is no crs.'
			// }
			// }
			//
			// } else {
			// throw {
			// name : errorName,
			// message : 'Options.task.crs is not a string.'
			// }
			// }
			// } else {
			// throw {
			// name : errorName,
			// message : 'Options.task.crs is undefined.'
			// }
			// }

			if (options.task.workspace) {
				if (isString(options.task.workspace)) {
					options.task.workspace = correctPath(options.task.workspace);

					if (isPath(options.task.workspace)) {

					} else {
						throw {
							name : errorName,
							message : 'Options.task.workspace is not a path.'
						}
					}

				} else {
					throw {
						name : errorName,
						message : 'Options.task.workspace is not a string.'
					}
				}
			} else {
				throw {
					name : errorName,
					message : 'Options.task.workspace is undefined.'
				}
			}

			if (options.task.area) {

				if (options.task.area.bbox) {

					if (options.task.area.bbox.xmin) {
						if (isNumber(options.task.area.bbox.xmin)) {

						} else {
							throw {
								name : errorName,
								message : 'Options.task.area.bbox.xmin is not a number.'
							}
						}
					} else {
						throw {
							name : errorName,
							message : 'Options.task.area.bbox.xmin is undefined.'
						}
					}

					if (options.task.area.bbox.ymin) {
						if (isNumber(options.task.area.bbox.ymin)) {

						} else {
							throw {
								name : errorName,
								message : 'Options.task.area.bbox.ymin is not a number.'
							}
						}
					} else {
						throw {
							name : errorName,
							message : 'Options.task.area.bbox.ymin is undefined.'
						}
					}

					if (options.task.area.bbox.xmax) {
						if (isNumber(options.task.area.bbox.xmax)) {

						} else {
							throw {
								name : errorName,
								message : 'Options.task.area.bbox.xmax is not a number.'
							}
						}
					} else {
						throw {
							name : errorName,
							message : 'Options.task.area.bbox.xmax is undefined.'
						}
					}

					if (options.task.area.bbox.ymax) {
						if (isNumber(options.task.area.bbox.ymax)) {

						} else {
							throw {
								name : errorName,
								message : 'Options.task.area.bbox.ymax is not a number.'
							}
						}
					} else {
						throw {
							name : errorName,
							message : 'Options.task.area.bbox.ymax is undefined.'
						}
					}

					// if (options.task.area.bbox.crs) {
					// if (isString(options.task.area.bbox.crs)) {
					// if (isCRS(options.task.area.bbox.crs)) {
					// } else {
					// throw {
					// name : errorName,
					// message : 'Options.task.area.bbox.crs is not a string like
					// "EPSG:25832".'
					// }
					// }
					// } else {
					// throw {
					// name : errorName,
					// message : 'Options.task.area.bbox.crs is not a string.'
					// }
					// }
					// } else {
					// throw {
					// name : errorName,
					// message : 'Options.task.area.bbox.crs is undefined.'
					// }
					// }

				} else {
					throw {
						name : errorName,
						message : 'Options.task.area.bbox is undefined.'
					}
				}

				if (options.task.area.polygon) {

					if (options.task.area.polygon.wkt) {
						if (isString(options.task.area.polygon.wkt)) {

							if (isPolygonWKT(options.task.area.polygon.wkt)) {
							} else {
								throw {
									name : errorName,
									message : 'Options.task.area.polygon.wkt is not a polygon wkt.'
								}
							}

						} else {
							throw {
								name : errorName,
								message : 'Options.task.area.polygon.wkt is not a string.'
							}
						}
					} else {
						throw {
							name : errorName,
							message : 'Options.task.area.polygon.wkt is undefined.'
						}
					}

					if (options.task.area.polygon.crs) {
						if (isString(options.task.area.polygon.crs)) {
							if (isCRS(options.task.area.polygon.crs)) {
							} else {
								throw {
									name : errorName,
									message : 'Options.task.area.polygon.crs is not a string like "EPSG:25832".'
								}
							}

						} else {
							throw {
								name : errorName,
								message : 'Options.task.area.polygon.crs is not a string.'
							}
						}
					} else {
						throw {
							name : errorName,
							message : 'Options.task.area.polygon.crs is undefined.'
						}
					}

				} else {
					// No error
					// options.task.polygon is optional
				}

			} else {
				throw {
					name : errorName,
					message : 'Options.task.area is undefined.'
				}
			}

		} else {
			throw {
				name : errorName,
				message : 'Options.task is undefined.'
			}
		}

		if (options.tiles) {

			if (options.tiles.maxSizePx) {
				if (isInteger(options.tiles.maxSizePx)) {

				} else {
					throw {
						name : errorName,
						message : 'Options.tiles.maxSizePx is not a integer.'
					}
				}

			} else {
				throw {
					name : errorName,
					message : 'Options.tiles.maxSizePx is undefined.'
				}
			}

			if (options.tiles.gutterPx) {

				if (isInteger(options.tiles.gutterPx)) {

				} else {
					throw {
						name : errorName,
						message : 'Options.tiles.gutterPx is not a integer.'
					}
				}

			} else {
				// No error
				// options.tiles.gutterPx is optional
			}

			if (options.tiles.resolutions) {

				if (isArray(options.tiles.resolutions)) {

					if (options.tiles.resolutions.length !== 0) {

						// Iterate over all resolutions
						options.tiles.resolutions.forEach(function(r) {

							if (r.scale) {
								if (isNumber(r.scale)) {

								} else {
									throw {
										name : errorName,
										message : 'Options.tiles.resolutions[i].scale is not a number.'
									}
								}

							} else {

								if (!r.groundResolution) {
									throw {
										name : errorName,
										message : 'Options.tiles.resolutions[i].scale is undefined.'
									}
								}
							}

							if (r.dpi) {
								if (isNumber(r.dpi)) {

								} else {

									throw {
										name : errorName,
										message : 'Options.tiles.resolutions[i].dpi is not a number.'
									}

								}

								if (r.id) {

								} else {
									// Options.tiles.resolutions[i].id is optional
									// Generate a ID
									r.id = createResolutionId(r.scale, r.dpi);
								}

							} else {
								if (!r.groundResolution) {
									throw {
										name : errorName,
										message : 'Options.tiles.resolutions[i].dpi is undefined.'
									}
								}
							}

							// Calculate resolution
							if(!r.groundResolution){
								r.groundResolution = (0.0254 * r.scale) / r.dpi;
							}
							

						});

					} else {
						throw {
							name : errorName,
							message : 'Options.tiles.resolutions array is empty.'
						}
					}

				} else {
					throw {
						name : errorName,
						message : 'Options.tiles.resolutions is not an array.'
					}
				}

			} else {
				throw {
					name : errorName,
					message : 'Options.tiles.resolutions is undefined.'
				}
			}

		} else {
			throw {
				name : errorName,
				message : 'Options.tiles is undefined.'
			}
		}

		if (options.wms) {
			if (isArray(options.wms)) {

				if (options.wms.length !== 0) {

					// Iterate over all wms
					options.wms.forEach(function(m) {
						// TODO all fields
					});

				} else {
					throw {
						name : errorName,
						message : 'Options.wms is empty.'
					}
				}

			} else {
				throw {
					name : errorName,
					message : 'Options.wms is not an array.'
				}
			}

		} else {
			throw {
				name : errorName,
				message : 'Options.wms is undefined.'
			}
		}

	} else {
		throw {
			name : errorName,
			message : 'Options is undefined.'
		}
	}
}

function isArray(obj) {
	if (obj.constructor === Array) {
		return true;
	}
	return false;
}

function isInteger(obj) {
	if (typeof obj == 'number') {

		// TODO is INTEGER
		if (true) {
			return true;
		}
	}
	return false;
}

function isNumber(obj) {
	if (typeof obj == 'number') {
		return true;
	}
	return false;
}

function isString(obj) {
	if (typeof obj == 'string') {
		return true;
	}
	return false;
}

function isPath(obj) {
	// TODO
	return true;
}

function isPolygonWKT(obj) {
	// TODO
	return true;
}

function isCRS(obj) {
	// TODO
	return true;
}

function isFormatSupported(obj) {
	if (getFormatDetails(obj)) {
		return true;
	}

	return false;
}

function createResolutionId(scale, dpi) {
	var ret = dpi.toString() + '_' + scale.toString();
	ret = ret.replace(new RegExp('[\.]', 'g'), '_');
	return ret;
}

function createTaskId() {
	return 'id_of_task' + Math.ceil(Math.random() * 1000000);
}

function correctPath(obj) {
	obj = obj.replace(new RegExp("[\\\\]", 'g'), '/');

	if (obj.match("/$")) {
		obj = obj.substring(0, obj.length - 2);
	}

	return obj;
}

module.exports = {
	checkOptions : checkOptions,
	getFormatDetails : getFormatDetails
}
