import React, { useEffect, useState } from "react";
import { adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminUpload, imgUrl, formatINR } from "../../api";
import { Loader2, Plus, Trash2, Save, X, Upload, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const CATS = ["lamps", "handbags", "sculptures", "decor", "custom"];
const TAGS = ["", "New", "Best Seller", "Limited"];

const emptyProduct = () => ({
  name: "", slug: "", category: "lamps", price: 0, description: "",
  material: "", dimensions: "", lead_time: "Ships in 3–5 days",
  tag: "", series: "", images: [], stock: 100, active: true, featured: false,
});

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product being edited or 'new'
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListProducts();
      setItems(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing(emptyProduct());
  const openEdit = (p) => setEditing({ ...p });
  const close = () => setEditing(null);

  const upd = (k, v) => setEditing((e) => ({ ...e, [k]: v }));

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const f of files) {
        const r = await adminUpload(f);
        uploaded.push(r.url);
      }
      upd("images", [...(editing.images || []), ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImg = (idx) => upd("images", editing.images.filter((_, i) => i !== idx));

  const save = async () => {
    if (!editing.name || !editing.price) {
      toast.error("Name and price are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...editing, slug: editing.slug || slugify(editing.name), price: Number(editing.price), stock: Number(editing.stock || 100), tag: editing.tag || null };
      if (editing.id) {
        await adminUpdateProduct(editing.id, payload);
        toast.success("Product updated");
      } else {
        await adminCreateProduct(payload);
        toast.success("Product created");
      }
      close();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Save failed");
    } finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteProduct(p.id);
      toast.success("Product deleted");
      load();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-display text-4xl text-[var(--espresso)]">Products</h1>
          <p className="text-sm text-[var(--espresso)]/60 mt-2">{items.length} pieces in the studio</p>
        </div>
        <button onClick={openNew} className="vc-btn-copper h-11 px-6 text-xs tracking-[0.2em] uppercase inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></div>
      ) : (
        <div className="mt-8 bg-white border border-[var(--sand)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/60 border-b border-[var(--sand)]">
                <th className="text-left px-6 py-3">Product</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Price</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-[var(--sand)] last:border-0 hover:bg-[var(--ivory)]/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-16 bg-[var(--sand)] overflow-hidden flex-shrink-0">
                        {p.images?.[0] && <img src={imgUrl(p.images[0])} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-serif-display text-lg">{p.name}</p>
                        <p className="text-xs text-[var(--espresso)]/50">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{p.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.active ? <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase bg-[var(--sand)]">Live</span> : <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase bg-red-100 text-red-800">Hidden</span>}
                      {p.featured && <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase bg-[var(--copper)] text-white">Featured</span>}
                      {p.tag && <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase border border-[var(--copper)] text-[var(--copper)]">{p.tag}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-serif-display text-xl">{formatINR(p.price)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs tracking-widest uppercase text-[var(--copper)] vc-link-underline">Edit</button>
                      <button onClick={() => remove(p)} className="text-xs tracking-widest uppercase text-red-600 vc-link-underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end" onClick={close}>
          <div className="w-full max-w-2xl bg-[var(--cream)] h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[var(--cream)] border-b border-[var(--sand)] px-8 py-5 flex items-center justify-between">
              <h2 className="font-serif-display text-2xl">{editing.id ? "Edit product" : "New product"}</h2>
              <button onClick={close} className="p-2 hover:text-[var(--copper)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Name *</label><input value={editing.name} onChange={(e) => { const v = e.target.value; upd("name", v); if (!editing.id && !editing.slug) upd("slug", slugify(v)); }} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Slug</label><input value={editing.slug} onChange={(e) => upd("slug", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Category</label><select value={editing.category} onChange={(e) => upd("category", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]">{CATS.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Tag</label><select value={editing.tag || ""} onChange={(e) => upd("tag", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]">{TAGS.map((t) => (<option key={t} value={t}>{t || "— none —"}</option>))}</select></div>
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Price (₹) *</label><input type="number" value={editing.price} onChange={(e) => upd("price", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
              </div>
              <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Description</label><textarea rows={4} value={editing.description} onChange={(e) => upd("description", e.target.value)} className="w-full p-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Material</label><input value={editing.material} onChange={(e) => upd("material", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Dimensions</label><input value={editing.dimensions} onChange={(e) => upd("dimensions", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Lead time</label><input value={editing.lead_time} onChange={(e) => upd("lead_time", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Series</label><input value={editing.series || ""} onChange={(e) => upd("series", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Stock</label><input type="number" value={editing.stock} onChange={(e) => upd("stock", e.target.value)} className="w-full h-11 px-3 border border-[var(--sand)] bg-white focus:outline-none focus:border-[var(--copper)]" /></div>
                <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={editing.active} onChange={(e) => upd("active", e.target.checked)} className="w-4 h-4 accent-[var(--copper)]" /><span className="text-sm">Active (live)</span></label>
                <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={editing.featured} onChange={(e) => upd("featured", e.target.checked)} className="w-4 h-4 accent-[var(--copper)]" /><span className="text-sm">Featured on home</span></label>
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Images</label>
                <div className="grid grid-cols-4 gap-3">
                  {editing.images?.map((src, i) => (
                    <div key={i} className="relative aspect-square bg-[var(--sand)] overflow-hidden group">
                      <img src={imgUrl(src)} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImg(i)} className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-[var(--sand)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[var(--copper)] hover:text-[var(--copper)]">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                    <span className="text-[10px] tracking-widest uppercase">Upload</span>
                    <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-[var(--cream)] border-t border-[var(--sand)] px-8 py-5 flex justify-end gap-3">
              <button onClick={close} className="h-11 px-6 text-xs tracking-[0.2em] uppercase border border-[var(--sand)] hover:border-[var(--copper)]">Cancel</button>
              <button onClick={save} disabled={saving} className="h-11 px-6 vc-btn-copper text-xs tracking-[0.2em] uppercase inline-flex items-center gap-2 disabled:opacity-60">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
