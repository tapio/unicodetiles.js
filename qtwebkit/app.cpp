#include <QApplication>
#include <QGraphicsScene>
#include <QGraphicsView>
#include <QGraphicsWebView>


int main(int argc, char **argv) {
	QApplication app(argc, argv);
	const int width = 1024;
	const int height = 768;

	QGraphicsScene scene;

	QGraphicsView view(&scene);
	view.setWindowTitle("Game");
	view.setFrameShape(QFrame::NoFrame);
	view.setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
	view.setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

	QGraphicsWebView webview;
	webview.resize(width, height);
	webview.load(QUrl("index.html"));

	scene.addItem(&webview);

	view.resize(width, height);
	view.show();

	return app.exec();
}
