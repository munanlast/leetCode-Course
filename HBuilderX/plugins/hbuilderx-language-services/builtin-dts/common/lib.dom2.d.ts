/// <reference path="../node_modules/@dcloudio/types/lib/HBuilderX.d.ts" />

interface NamedNodeMap {
  readonly length: number;
  getNamedItem(qualifiedName: string | HBuilderX.AttrString): Attr | null;
}

interface Document {
  createAttribute(localName: string | HBuilderX.AttrString): Attr;
}

interface Element {
  hasAttribute(qualifiedName: string | HBuilderX.AttrString): boolean;
  removeAttribute(qualifiedName: string | HBuilderX.AttrString): void;
  setAttribute(qualifiedName: string | HBuilderX.AttrString, value: string | HBuilderX.AttrValueString): void;
  getAttribute(qualifiedName: string | HBuilderX.AttrString): string | HBuilderX.AttrValueString | null;
  getAttributeNode(qualifiedName: string | HBuilderX.AttrString): Attr | null;
  getAttributeNodeNS(namespace: string | null, localName: string | HBuilderX.AttrString): Attr | null;
  getAttributeNS(namespace: string | null, localName: string | HBuilderX.AttrString): string | null;
}