import StickerFace from './StickerFace';
import { colors } from './uiStyles';

export default function DesktopStage() {
  return (
    <div className="desktop-stage" aria-hidden="true">
      <div className="stage-side stage-left">
        <div className="stage-blob stage-blob-green">
          <StickerFace color={colors.accent2} mood="happy" size={92} />
        </div>
        <div className="stage-card stage-card-yellow">
          <p>Today score</p>
          <strong>82%</strong>
          <span>steady day</span>
        </div>
        <div className="stage-mini stage-mini-blue">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="stage-blob stage-blob-pink">
          <StickerFace color={colors.pink} mood="sleepy" size={68} />
        </div>
      </div>

      <div className="stage-side stage-right">
        <div className="stage-calendar">
          {Array.from({ length: 28 }, (_, index) => (
            <span
              key={index}
              className={index % 5 === 0 ? 'is-yellow' : index % 4 === 0 ? 'is-pink' : index % 3 === 0 ? 'is-blue' : 'is-green'}
            />
          ))}
        </div>
        <div className="stage-card stage-card-lilac">
          <p>LifeLog</p>
          <strong>Personal OS</strong>
          <span>private tracker</span>
        </div>
        <div className="stage-blob stage-blob-orange">
          <StickerFace color={colors.orange} mood="neutral" size={76} />
        </div>
      </div>
    </div>
  );
}
