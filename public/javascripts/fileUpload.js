FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRation: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargerHeight: 150,
});

FilePond.parse(document.body);
