/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronRight, Lock, Plus, Edit2, Trash2, Save, Quote } from 'lucide-react';
import { supabase } from './lib/supabase';

// --- Types & Initial Data ---

interface Shoe {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  imageUrl: string;
}

const INITIAL_SHOES: Shoe[] = [
  {
    id: '1',
    name: 'Aurelia High Heel',
    description: 'A masterpiece of balance and elegance. Features a 105mm stiletto and subtle 18k gold-plated accents.',
    price: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Onyx Oxford Flat',
    description: 'Jewelry-grade craftsmanship meets everyday comfort. Hand-polished black calfskin with minimal gold detailing.',
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Obsidian Formal Boot',
    description: 'Command the room. Chelsea-style formal boot crafted from premium full-grain leather for the modern elite.',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop',
  },
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Amina D.',
    quote: 'The craftsmanship on my custom heels is unlike anything I’ve seen in Nigeria. Absolutely stunning.',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa8c?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Kingsley O.',
    quote: 'SIMsignature brought my old oxfords back to life with their maintenance service. Returning customer for sure.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Sarah M.',
    quote: 'Walking into an event wearing these feels like an instant confidence boost. A true luxury experience.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
  }
];

// --- Helper Functions ---

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<'main' | 'admin'>('main');
  const [shoes, setShoes] = useState<Shoe[]>(INITIAL_SHOES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sync with Supabase
  const fetchShoes = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('shoes').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching shoes:', error);
    } else if (data) {
      const fetchedShoes = data.map(item => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image_url,
      }));
      setShoes(fetchedShoes);
    }
  };

  const fetchTestimonials = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching testimonials:', error);
    } else if (data) {
      const fetchedTestimonials = data.map(item => ({
        id: item.id.toString(),
        name: item.name,
        quote: item.quote,
        imageUrl: item.image_url,
      }));
      setTestimonials(fetchedTestimonials);
    }
  };

  useEffect(() => {
    fetchShoes();
    fetchTestimonials();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsNavOpen(false);
    setView('main');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // --- Subcomponents ---

  const Navigation = () => (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || view === 'admin' ? 'bg-black-950/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => { setView('main'); scrollToSection('home'); }}
        >
          <img src="https://i.ibb.co/Fq8trq8J/IMG-20260501-WA0055.jpg" alt="SIMsignature Logo" className="h-20 md:h-24 w-auto object-contain mix-blend-screen" />
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center text-sm tracking-wider uppercase">
          {view === 'admin' ? (
            <button onClick={() => setView('main')} className="text-white hover:text-gold-400 transition-colors">
              Back to Site
            </button>
          ) : (
            <>
              <button onClick={() => scrollToSection('home')} className="text-white hover:text-gold-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-white hover:text-gold-400 transition-colors">About Us</button>
              <button onClick={() => scrollToSection('gallery')} className="text-white hover:text-gold-400 transition-colors">Gallery</button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-gold-400 transition-colors">Contact</button>
              <button onClick={() => setView('admin')} className="text-white/50 hover:text-gold-400 transition-colors flex items-center">
                <Lock size={14} className="mr-1" /> Admin
              </button>
            </>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-gold-500" onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isNavOpen && (
        <div className="absolute top-full left-0 w-full bg-black-950 border-b border-white/5 flex flex-col items-center py-8 space-y-6 md:hidden text-sm tracking-wider uppercase">
          {view === 'admin' ? (
             <button onClick={() => setView('main')} className="text-white hover:text-gold-400 transition-colors">
             Back to Site
           </button>
          ) : (
            <>
              <button onClick={() => scrollToSection('home')} className="text-white hover:text-gold-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-white hover:text-gold-400 transition-colors">About Us</button>
              <button onClick={() => scrollToSection('gallery')} className="text-white hover:text-gold-400 transition-colors">Gallery</button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-gold-400 transition-colors">Contact</button>
              <button onClick={() => { setView('admin'); setIsNavOpen(false); }} className="text-white/50 hover:text-gold-400 transition-colors flex items-center">
                <Lock size={14} className="mr-1" /> Admin
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );

  const Hero = () => (
    <section id="home" className="relative h-screen bg-hero-pattern flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-black-950 via-transparent to-black-950/40" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold-400 tracking-[0.3em] text-xs md:text-sm uppercase mb-6"
        >
          Bukuru Low-Cost, Plateau State
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-8"
        >
          SIM<span className="font-semibold text-gold-500">signature</span>
        </motion.h1>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="w-16 h-[1px] bg-gold-500 mb-8"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl font-light text-white/80 tracking-wide"
        >
          Crafting elegance, comfort, and statements.
        </motion.p>
      </div>
    </section>
  );

  const About = () => (
    <section id="about" className="py-32 px-6 bg-black-950 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-gold-500 text-sm tracking-[0.2em] uppercase mb-6">The Legacy & Care</div>
        <h2 className="text-4xl md:text-5xl font-serif mb-12 leading-tight">
          Jewelry-grade footwear, built on mastery and precision.
        </h2>
        <div className="w-px h-24 bg-gradient-to-b from-gold-500 to-transparent mx-auto mb-12" />
        <p className="text-white/60 text-lg leading-relaxed font-light mb-8 max-w-2xl mx-auto">
          Based in the heart of Bukuru Low-Cost, Plateau State, SIMsignature redefines the boundary between accessory and art. Every pair is an obsession with detail, using only premium quality materials selected for their character and endurance.
        </p>
        <p className="text-white/60 text-lg leading-relaxed font-light max-w-2xl mx-auto">
          Beyond crafting new experiences, we offer premium maintenance services to ensure your signature pieces retain their pristine elegance and longevity. We don't just make shoes; we craft experiences for those who step into rooms expecting to own them.
        </p>
      </div>
    </section>
  );

  const Gallery = () => (
    <section id="gallery" className="py-32 px-6 bg-black-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="text-gold-500 text-xs tracking-[0.2em] uppercase mb-4">The Collection</div>
            <h2 className="text-4xl md:text-5xl font-serif">Signature Pieces</h2>
          </div>
          <button onClick={() => scrollToSection('contact')} className="group flex items-center text-sm uppercase tracking-widest text-white/80 hover:text-gold-500 transition-colors pb-2 border-b border-white/20 hover:border-gold-500">
            Request Custom Order
            <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {shoes.map((shoe, idx) => (
            <motion.div 
              key={shoe.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden mb-6 relative bg-black-800">
                <img 
                  src={shoe.imageUrl || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800"} 
                  alt={shoe.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-sm tracking-widest uppercase border border-gold-500 text-gold-500 px-4 py-2 hover:bg-gold-500 hover:text-black-950 transition-colors w-full text-center">
                    View Details
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-2xl mb-2 group-hover:text-gold-400 transition-colors">{shoe.name}</h3>
                <p className="text-white/50 text-sm font-light mb-4 line-clamp-2">{shoe.description}</p>
                <div className="text-gold-500 font-medium tracking-wide">{formatPrice(shoe.price)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  const Testimonials = () => (
    <section id="testimonials" className="py-24 px-6 bg-black-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <div className="text-gold-500 text-xs tracking-[0.2em] uppercase mb-4">Client Voices</div>
           <h2 className="text-4xl md:text-5xl font-serif">Worn with Confidence</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {testimonials.map((testimonial, idx) => (
             <motion.div
               key={testimonial.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: idx * 0.2 }}
               className="p-8 border border-white/5 bg-black-950 relative flex flex-col items-center"
             >
               <Quote className="absolute top-4 left-4 w-8 h-8 text-gold-500/20" />
               <div className="w-20 h-20 rounded-full border border-gold-500/50 mb-6 overflow-hidden">
                 <img src={testimonial.imageUrl} alt={testimonial.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale opacity-80" />
               </div>
               <p className="text-white/70 font-light leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
               <div className="text-gold-500 font-serif tracking-widest">{testimonial.name}</div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  const Contact = () => {
    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const message = formData.get('message') as string;

      const subject = encodeURIComponent(`SIMsignature Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:rosemaryaugustine147@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
      <section id="contact" className="py-32 px-6 bg-black-950">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <div className="text-gold-500 text-xs tracking-[0.2em] uppercase mb-4">Get in Touch</div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">We await your correspondence.</h2>
            <div className="space-y-6 text-white/70 font-light mb-12">
              <div>
                <p className="text-xs tracking-widest text-white/40 uppercase mb-1">Atelier Location</p>
                <p>Bukuru Low-Cost<br />Plateau State, Nigeria</p>
              </div>
              <div>
                <p className="text-xs tracking-widest text-white/40 uppercase mb-1">Direct Line / WhatsApp</p>
                <a href="https://wa.me/2349128189827" target="_blank" rel="noreferrer" className="block hover:text-gold-500 transition-colors">+234 (0) 912 818 9827</a>
              </div>
              <div>
                <p className="text-xs tracking-widest text-white/40 uppercase mb-1">Inquiries</p>
                <a href="mailto:rosemaryaugustine147@gmail.com" className="block hover:text-gold-500 transition-colors">rosemaryaugustine147@gmail.com</a>
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-black-900 border border-white/5 p-8 md:p-12">
            <form className="space-y-8" onSubmit={handleContactSubmit}>
              <div className="group">
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Full Name" 
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 transition-colors font-light"
                />
              </div>
              <div className="group">
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Email Address" 
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 transition-colors font-light"
                />
              </div>
              <div className="group">
                <textarea 
                  name="message"
                  required
                  placeholder="Message or Custom Request" 
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 transition-colors font-light resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-gold-500 hover:bg-gold-400 text-black-950 font-medium tracking-wide py-4 uppercase text-sm transition-colors">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  };

  const Footer = () => (
    <footer className="border-t border-white/5 bg-black-950 py-12 px-6 text-center text-sm font-light tracking-wide text-white/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>&copy; {new Date().getFullYear()} SIMsignature. All rights reserved.</div>
        <div className="text-gold-500 font-serif text-xl tracking-widest uppercase">SIMsignature</div>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="https://wa.me/2349128189827" target="_blank" rel="noreferrer" className="hover:text-gold-500 transition-colors">WhatsApp</a>
          <a href="https://instagram.com/sims_ignature" target="_blank" rel="noreferrer" className="hover:text-gold-500 transition-colors">Instagram</a>
          <a href="https://tiktok.com/@simsignature" target="_blank" rel="noreferrer" className="hover:text-gold-500 transition-colors">TikTok</a>
          <a href="https://facebook.com/search/top?q=Rose%20Mary%20Augutine" target="_blank" rel="noreferrer" className="hover:text-gold-500 transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );

  // --- Admin Panel Component ---

  const AdminPanel = () => {
    const [passwordInput, setPasswordInput] = useState('');
    const [adminView, setAdminView] = useState<'shoes' | 'testimonials'>('shoes');
    
    // Shoe State
    const [editingShoe, setEditingShoe] = useState<Shoe | null>(null);
    const [formData, setFormData] = useState<Partial<Shoe>>({});

    // Testimonial State
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [testFormData, setTestFormData] = useState<Partial<Testimonial>>({});

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxSize = 800; // Compress image to avoid crashing local storage
            if (width > height && width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setter((prev: any) => ({ ...prev, imageUrl: dataUrl }));
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    };

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Simple hardcoded password for demonstration
      if (passwordInput === 'jaxie123') {
        setIsAdminAuthenticated(true);
      } else {
        alert('Incorrect password. Hint: jaxie123');
      }
    };

    const handleSaveShoe = async () => {
      if (!formData.name || !formData.price || !formData.imageUrl) {
        alert('Please fill required fields (Name, Price, Image URL)');
        return;
      }
      if (!supabase) return;

      const payload = {
        name: formData.name,
        description: formData.description || '',
        price: Number(formData.price),
        image_url: formData.imageUrl,
      };

      if (editingShoe) {
        setShoes(shoes.map(s => s.id === editingShoe.id ? { ...s, ...formData } as Shoe : s));
        const { error } = await supabase.from('shoes').update(payload).eq('id', editingShoe.id);
        if (error) { console.error('Error updating shoe:', error); fetchShoes(); }
      } else {
        const tempId = Date.now().toString();
        setShoes([{ ...payload, id: tempId, imageUrl: payload.image_url }, ...shoes]);
        const { error } = await supabase.from('shoes').insert([payload]);
        if (error) { console.error('Error inserting shoe:', error); }
        fetchShoes();
      }
      setEditingShoe(null);
      setFormData({});
    };

    const handleDeleteShoe = async (id: string) => {
      if (!supabase) return;
      setShoes(shoes.filter(s => s.id !== id));
      const { error } = await supabase.from('shoes').delete().eq('id', id);
      if (error) { console.error('Error deleting shoe:', error); fetchShoes(); }
    };

    const handleSaveTestimonial = async () => {
      if (!testFormData.name || !testFormData.quote || !testFormData.imageUrl) {
        alert('Please fill all required fields (Name, Quote, Image URL)');
        return;
      }
      if (!supabase) return;

      const payload = {
        name: testFormData.name,
        quote: testFormData.quote,
        image_url: testFormData.imageUrl,
      };

      if (editingTestimonial) {
        setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? { ...t, ...testFormData } as Testimonial : t));
        const { error } = await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id);
        if (error) { console.error('Error updating testimonial:', error); fetchTestimonials(); }
      } else {
        const tempId = Date.now().toString();
        setTestimonials([{ ...payload, id: tempId, imageUrl: payload.image_url }, ...testimonials]);
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) { console.error('Error inserting testimonial:', error); }
        fetchTestimonials();
      }
      setEditingTestimonial(null);
      setTestFormData({});
    };

    const handleDeleteTestimonial = async (id: string) => {
      if (!supabase) return;
      setTestimonials(testimonials.filter(t => t.id !== id));
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) { console.error('Error deleting testimonial:', error); fetchTestimonials(); }
    };

    const startEditShoe = (shoe: Shoe) => {
      setEditingShoe(shoe);
      setFormData({ ...shoe });
    };

    const startNewShoe = () => {
      setEditingShoe(null);
      setFormData({ name: '', description: '', price: 0, imageUrl: '' });
    };

    const startEditTestimonial = (test: Testimonial) => {
      setEditingTestimonial(test);
      setTestFormData({ ...test });
    };

    const startNewTestimonial = () => {
      setEditingTestimonial(null);
      setTestFormData({ name: '', quote: '', imageUrl: '' });
    };

    const handleSeedShoes = async () => {
      if (!supabase) return;
      const seedData = INITIAL_SHOES.map(s => ({
        name: s.name,
        price: s.price,
        description: s.description,
        image_url: s.imageUrl
      }));
      await supabase.from('shoes').insert(seedData);
      fetchShoes();
    };

    const handleSeedTestimonials = async () => {
      if (!supabase) return;
      const seedData = INITIAL_TESTIMONIALS.map(t => ({
        name: t.name,
        quote: t.quote,
        image_url: t.imageUrl
      }));
      await supabase.from('testimonials').insert(seedData);
      fetchTestimonials();
    };

    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-black-950 flex justify-center items-center px-6 pt-20">
          <div className="w-full max-w-md bg-black-900 border border-white/10 p-10 text-center">
            <Lock className="w-12 h-12 text-gold-500 mx-auto mb-6 opacity-80" />
            <h2 className="font-serif text-3xl mb-2">Restricted Access</h2>
            <p className="text-white/50 text-sm mb-8 font-light tracking-wide">Enter the atelier code.</p>
            <form onSubmit={handleLogin} className="space-y-6">
               <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password" 
                  className="w-full bg-black-950 border border-white/20 px-4 py-3 text-center text-white placeholder-white/30 focus:outline-none focus:border-gold-500 transition-colors tracking-widest"
                />
                <button type="submit" className="w-full bg-gold-500 hover:bg-gold-400 text-black-950 font-medium tracking-wide py-3 uppercase text-sm transition-colors">
                  Authenticate
                </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black-950 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Left: Editor Form */}
          <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-gold-500 mb-2">Atelier Control</h1>
              <p className="text-white/50 text-sm font-light">Manage your content.</p>
              
              <div className="flex space-x-1 bg-black-900 border border-white/10 p-1 mt-6">
                <button 
                  onClick={() => setAdminView('shoes')} 
                  className={`flex-1 py-2 text-xs uppercase tracking-widest ${adminView === 'shoes' ? 'bg-gold-500 text-black-950' : 'text-white/50 hover:text-white'}`}
                >
                  Products
                </button>
                <button 
                  onClick={() => setAdminView('testimonials')} 
                  className={`flex-1 py-2 text-xs uppercase tracking-widest ${adminView === 'testimonials' ? 'bg-gold-500 text-black-950' : 'text-white/50 hover:text-white'}`}
                >
                  Voices
                </button>
              </div>
            </div>

            {adminView === 'shoes' ? (
              <div className="bg-black-900 border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium tracking-wide uppercase text-sm">
                    {formData.id ? 'Edit Shoe Item' : 'New Shoe Item'}
                  </h3>
                  {formData.id && (
                    <button onClick={startNewShoe} className="text-xs text-white/50 hover:text-white flex items-center">
                      <Plus size={14} className="mr-1" /> New
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase text-white/50 mb-2">Item Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black-950 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-white/50 mb-2">Price (NGN)</label>
                    <input 
                      type="number" 
                      value={formData.price || ''}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-black-950 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-white/50 mb-2">Item Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setFormData)}
                      className="w-full bg-black-950 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-gold-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-black-950 hover:file:bg-gold-400"
                    />
                    {formData.imageUrl && (
                      <div className="mt-4 w-24 h-24 bg-black-950 overflow-hidden border border-white/10 relative">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute top-1 right-1 bg-black-950 text-white rounded-full p-1 border border-white/20"><X size={12} /></button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-white/50 mb-2">Description</label>
                    <textarea 
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full bg-black-950 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-gold-500 text-sm resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleSaveShoe}
                    className="w-full flex justify-center items-center bg-gold-500 hover:bg-gold-400 text-black-950 py-3 text-sm tracking-wide uppercase font-medium transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    Save Product
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-black-900 border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium tracking-wide uppercase text-sm">
                    {testFormData.id ? 'Edit Testimonial' : 'New Testimonial'}
                  </h3>
                  {testFormData.id && (
                    <button onClick={startNewTestimonial} className="text-xs text-white/50 hover:text-white flex items-center">
                      <Plus size={14} className="mr-1" /> New
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase text-white/50 mb-2">Client Name</label>
                    <input 
                      type="text" 
                      value={testFormData.name || ''}
                      onChange={(e) => setTestFormData({...testFormData, name: e.target.value})}
                      className="w-full bg-black-950 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-white/50 mb-2">Client Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setTestFormData)}
                      className="w-full bg-black-950 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-gold-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-black-950 hover:file:bg-gold-400"
                    />
                    {testFormData.imageUrl && (
                      <div className="mt-4 w-16 h-16 rounded-full bg-black-950 overflow-hidden border border-white/10 relative">
                        <img src={testFormData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-white/50 mb-2">Quote</label>
                    <textarea 
                      value={testFormData.quote || ''}
                      onChange={(e) => setTestFormData({...testFormData, quote: e.target.value})}
                      rows={5}
                      className="w-full bg-black-950 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-gold-500 text-sm resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleSaveTestimonial}
                    className="w-full flex justify-center items-center bg-gold-500 hover:bg-gold-400 text-black-950 py-3 text-sm tracking-wide uppercase font-medium transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    Save Voice
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Items List */}
          <div className="w-full lg:w-2/3">
            {adminView === 'shoes' ? (
              <>
                <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                   <h3 className="font-serif text-2xl">Current Listings</h3>
                   <span className="text-sm text-gold-500 tracking-wider">{shoes.length} Items</span>
                </div>
                
                <div className="space-y-4">
                  {shoes.map(shoe => (
                    <div key={shoe.id} className="bg-black-900 border border-white/5 flex items-center p-4 group">
                      <div className="w-20 h-20 bg-black-950 flex-shrink-0 mr-6 overflow-hidden">
                        <img referrerPolicy="no-referrer" src={shoe.imageUrl} alt={shoe.name} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-serif text-lg mb-1">{shoe.name}</h4>
                        <div className="text-gold-500 text-sm tracking-wide">{formatPrice(shoe.price)}</div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditShoe(shoe)}
                          className="p-2 text-white/50 hover:text-gold-500 bg-black-950 border border-white/10 hover:border-gold-500 transition-all rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteShoe(shoe.id)}
                          className="p-2 text-white/50 hover:text-red-500 bg-black-950 border border-white/10 hover:border-red-500 transition-all rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {shoes.length === 0 && (
                    <div className="text-center py-20 text-white/40 font-light border border-dashed border-white/10 flex flex-col items-center justify-center">
                      <p className="mb-4">No products in the collection.</p>
                      <button 
                        onClick={handleSeedShoes}
                        className="bg-gold-500 hover:bg-gold-400 text-black-950 font-medium tracking-wide py-2 px-6 uppercase text-xs transition-colors"
                      >
                        Seed Default Data
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                   <h3 className="font-serif text-2xl">Client Voices</h3>
                   <span className="text-sm text-gold-500 tracking-wider">{testimonials.length} Voices</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(test => (
                    <div key={test.id} className="bg-black-900 border border-white/5 p-6 group relative">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img src={test.imageUrl} alt={test.name} className="w-full h-full object-cover grayscale opacity-80" />
                        </div>
                        <h4 className="font-serif text-lg text-gold-500">{test.name}</h4>
                      </div>
                      <p className="text-sm text-white/70 italic font-light line-clamp-3">"{test.quote}"</p>
                      
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditTestimonial(test)}
                          className="p-2 text-white/50 hover:text-gold-500 bg-black-950 border border-white/10 hover:border-gold-500 transition-all rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTestimonial(test.id)}
                          className="p-2 text-white/50 hover:text-red-500 bg-black-950 border border-white/10 hover:border-red-500 transition-all rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {testimonials.length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-20 text-white/40 font-light border border-dashed border-white/10 flex flex-col items-center justify-center">
                      <p className="mb-4">No testimonials in the collection.</p>
                      <button 
                        onClick={handleSeedTestimonials}
                        className="bg-gold-500 hover:bg-gold-400 text-black-950 font-medium tracking-wide py-2 px-6 uppercase text-xs transition-colors"
                      >
                        Seed Default Data
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-gold-500 selection:text-black-950">
      <Navigation />
      
      {view === 'admin' ? (
        <AdminPanel />
      ) : (
        <main>
          <Hero />
          <About />
          <Gallery />
          <Testimonials />
          <Contact />
          <Footer />
        </main>
      )}
    </div>
  );
}

