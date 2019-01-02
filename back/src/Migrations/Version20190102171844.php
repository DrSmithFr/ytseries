<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190102171844 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE series_type ADD import_code VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE series ADD import_code VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE seasons ADD import_code VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE episodes ADD import_code VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE seasons DROP import_code');
        $this->addSql('ALTER TABLE episodes DROP import_code');
        $this->addSql('ALTER TABLE series DROP import_code');
        $this->addSql('ALTER TABLE series_type DROP import_code');
    }
}
