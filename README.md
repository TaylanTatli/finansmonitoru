<br/>
<p align="center">
  <a href="https://github.com/TaylanTatli/finansmonitoru">
    <img src="https://user-images.githubusercontent.com/754514/216790467-fc8b1ef9-e28b-48b4-8de6-fbd267601f2b.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Finans Monitörü</h3>

  <p align="center">
    Altın ve Döviz fiyatlarını gerçek zamanlı olarak finans.truncgil.com üzerinden takip eden bir Gnome Uzantısı.
    <br/>
    <br/>
    <a href="https://extensions.gnome.org/extension/5739/finans-monitoru/">Yükle</a>
    .
    <a href="https://github.com/TaylanTatli/finansmonitoru/issues">Hata Bildirimi</a>
    .
    <a href="https://github.com/TaylanTatli/finansmonitoru/issues">Talepte Bulun</a>
  </p>
</p>

![Issues](https://img.shields.io/github/issues/TaylanTatli/finansmonitoru) ![License](https://img.shields.io/github/license/TaylanTatli/finansmonitoru) 

## Proje Hakkında

![Screen Shot](https://user-images.githubusercontent.com/754514/216790566-68715b06-5148-407a-8046-6534b8e0526f.png)

Altın ve Döviz fiyatlarını gerçek zamanlı olarak finans.truncgil.com tarafından sağlanan API'yi kullanarak takip edebileceğiniz basit bir Gnome eklentisidir. [goldpricemonitor](https://github.com/wotmshuaisi/goldpricemonitor) temel alınarak oluşturulmuştur.

## Başlangıç

Uzantıyı en basit haliyle extensions.gnome.org üzerinden yükleyebilirsiniz.

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="100" align="middle">][ego]

### Kurulum

Basit ve en garanti yolu [Gnome Extensions](https://extensions.gnome.org/extension/5739/finans-monitoru/) websitesi üzerinden yüklemek olacaktır.

Eğer manüel yüklemek isterseniz aşağıdaki komutu çalıştırın.

```sh
mkdir -p ~/.local/share/gnome-shell/extensions
git clone https://github.com/TaylanTatli/finansmonitoru ~/.local/share/gnome-shell/extensions/Finans_Monitor@taylantatli_github
```

Kurulumdan sonra eğer **Xorg** üzerindeyseniz `ALT+F2` tuş kombinasyonuna basarak açılan satıra `r` yazıp Gnome'u yeniden başlatın.
Eğer **Wayland** üzerindeyseniz oturumu kapatım tekrar giriş yapın.

## Kullanım

Ayarlar üzerinden gösterilecek Altın ve Döviz türlerini, panel pozisyonunu ve yenileme sıklığını değiştirebilirsiniz. Yenileme sıklığı dışında panel üzerinde eklentiye tıklayarak manüel olarak da yenileyebilirsiniz. Eklentiyi tıkladığınızda size son güncelleme tarihini ve yenileme butonunu gösteren bir menü açılır.

### Katkı Yapmak için.

1. Projeyi Çatallayın
2. Katkınız için ayrı bir dal oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add Some AmazingFeature')
4. Değişiklikleriniz gönderin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için bakınız: [LICENSE](https://github.com/TaylanTatli/finansmonitoru/blob/master/LICENSE).

## Teşekkür

* [WANGSHIFU - Gold Price Monitor](https://github.com/wotmshuaisi/goldpricemonitor)

[ego]: https://extensions.gnome.org/extension/5739/finans-monitoru/