import 'dart:typed_data';
import 'file_saver_stub.dart'
    if (dart.library.html) 'file_saver_web.dart';

Future<bool> saveFileBytes(Uint8List bytes, String filename) =>
    saveFileBytesImpl(bytes, filename);
